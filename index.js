require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { 
    Client, 
    GatewayIntentBits, 
    Partials, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle, 
    PermissionsBitField,
    MessageFlags
} = require('discord.js');

// ✅ Création automatique du dossier transcripts
const transcriptDir = path.join(__dirname, 'transcripts');
if (!fs.existsSync(transcriptDir)) {
    fs.mkdirSync(transcriptDir, { recursive: true });
    console.log('✅ Dossier transcripts créé.');
}

// ✅ Configuration du client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ],
    partials: [Partials.Channel]
});

// ✅ Connexion
client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// 🚀 Commande /nouveauticket
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'nouveauticket') {
        const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: 0, // Salon texte
            parent: process.env.CATEGORY_ID,
            permissionOverwrites: [
                {
                    id: interaction.guild.id,
                    deny: ['ViewChannel'],
                },
                {
                    id: interaction.user.id,
                    allow: ['ViewChannel', 'SendMessages'],
                },
            ],
        });

        // 📥 Embed avec les boutons
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('🎟️ Ticket Créé')
            .setDescription('Un membre de l\'équipe va bientôt vous assister.\n\n📌 **Boutons disponibles :**\n- **Réclamer** : Pour prendre en charge ce ticket.\n- **Fermer** : Pour clôturer ce ticket avec un motif.\n- **Inviter** : Pour ajouter temporairement un utilisateur.');

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('claim_ticket')
                    .setLabel('📌 Réclamer')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('close_ticket')
                    .setLabel('🔒 Fermer')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('invite_user')
                    .setLabel('➕ Inviter')
                    .setStyle(ButtonStyle.Primary)
            );

        await ticketChannel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: `🎟️ Ticket créé : ${ticketChannel}`, flags: MessageFlags.Ephemeral });

        // ⏳ Fermeture automatique après 24h d'inactivité
        setTimeout(async () => {
            const lastMessage = (await ticketChannel.messages.fetch({ limit: 1 })).first();
            if (lastMessage && Date.now() - lastMessage.createdTimestamp > 86400000) { // 24h
                await ticketChannel.send('⏳ Ticket inactif, fermeture automatique.');
                await closeTicket(ticketChannel, 'Inactivité prolongée');
            }
        }, 86400000);
    }
});

// 📌 Gestion des Boutons
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;

    const ticketChannel = interaction.channel;

    // 📌 Réclamer un ticket
    if (interaction.customId === 'claim_ticket') {
        await interaction.reply({ content: `✅ ${interaction.user.username} a réclamé ce ticket.` });
    }

    // 🔒 Fermer un ticket avec motif
    if (interaction.customId === 'close_ticket') {
        await interaction.reply({ content: '❓ Entrez le motif de la fermeture du ticket (30 secondes max).' });

        const filter = (response) => response.author.id === interaction.user.id;
        const collector = interaction.channel.createMessageCollector({ filter, time: 30000 });

        collector.on('collect', async (message) => {
            const reason = message.content;

            // 📝 Transcription
            const messages = await interaction.channel.messages.fetch();
            let transcript = messages.map(msg => `${msg.author.username}: ${msg.content}`).join('\n');
            const transcriptPath = path.join(transcriptDir, `${interaction.channel.name}.txt`);
            fs.writeFileSync(transcriptPath, transcript);

            await interaction.channel.send({
                content: `🔒 Ticket fermé par ${interaction.user.username}. **Motif :** ${reason}`
            });

            // Envoyer la transcription
            const logChannel = interaction.guild.channels.cache.get(process.env.LOG_CHANNEL_ID);
            if (logChannel) {
                await logChannel.send({
                    content: `📝 Transcription du ticket fermé par ${interaction.user.username} :`,
                    files: [transcriptPath]
                });
            }

            setTimeout(async () => {
                await interaction.channel.delete();
            }, 3000);

            collector.stop();
        });

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                interaction.channel.send({ content: '⏳ Temps écoulé, le ticket n\'a pas été fermé.' });
            }
        });
    }
});

client.login(process.env.TOKEN);

// Fait par la AxelCorp.
// axelcorp.netlify.app

