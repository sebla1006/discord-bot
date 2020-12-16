const Discord = require('discord.js');
const client = new Discord.Client();
const Canvas = require('canvas')
const fs = require('fs')
const bdd = require('./bdd.json');
const MessageAttachment = require('discord.js')

client.login(process.env.TOKEN)
const myGuild = client.guilds.cache.find(guild => guild.id === "787727188862566440")

client.on('ready', () =>{
    console.log('Re')
    client.channels.cache.find(channel => channel.id === '787727189310701578').messages.fetch('787767593552707655') 
    const updateMembers = (guild) => {
        const channelId = "787752616343371787"
        const channel = client.channels.cache.find(channel => channel.id === channelId)
        channel.setName(`『🌐』Membres: ${client.guilds.cache.find(guild => guild.id === "787727188862566440").memberCount.toLocaleString()} / 50`)
      }
    updateMembers(myGuild)
    bdd['memberCount'] = client.guilds.cache.find(guild => guild.id === "787727188862566440").memberCount.toLocaleString()
    Savebdd()
})
client.on('guildMemberRemove', member => {
    
    client.channels.cache.find(channel => channel.id === '787727189310701578').messages.fetch('787767593552707655') 
    const updateMembers = (guild) => {
        const channelId = "787752616343371787"
        const channel = client.channels.cache.find(channel => channel.id === channelId)
        bdd['memberCount'] = bdd.memberCount--
        channel.setName(`『🌐』Membres: ${bdd['memberCount']} / 50`)
      }
    updateMembers(myGuild)
})
client.on('guildMemberAdd', async member => {
    
    const updateMembers = (guild) => {
        const channelId = "787752616343371787"
        const channel = client.channels.cache.find(channel => channel.id === channelId)
        bdd['memberCount'] = bdd.memberCount--
        channel.setName(`『🌐』Membres: ${bdd['memberCount']} / 50`)
      }
    updateMembers(myGuild)
    const channel = client.channels.cache.get("787727740870066226");
  
    //if (!channel) return;
  
    const canvas = Canvas.createCanvas(700, 250);
    const ctx = canvas.getContext(`2d`);
  
    const background = await Canvas.loadImage(`./Welcome.jpg`);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
    ctx.font = '30px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`Hey ${member.user.username} ! Tu vas bien ?`, canvas.width / 2.5, canvas.height / 2.3);
      
    ctx.font = '35px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(`Serveur ${member.guild.name}`, canvas.width / 2.5, canvas.height / 1.7);
    
    ctx.font = '35px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`Test`, canvas.width / 2.5, canvas.height / 1.3);
    
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ format: `jpg` }));
    ctx.drawImage(avatar, 25, 25, 200, 200);
  
  
    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), './Welcome.jpg');
   
    channel.send(`Bienvenue ${member} !`, attachment);
    
})

function Savebdd() {
    fs.writeFile("./bdd.json", JSON.stringify(bdd, null, 4), (err) => {
      if(err) message.channel.send("Une erreur est survenue veuillez réessayer.")
    })}
client.on('messageReactionAdd', (messageReaction, user) =>{
   if(messageReaction.message.id === '787767593552707655'){
       if(messageReaction.emoji.name === '✅'){
        let membre = client.guilds.cache.find(guild => guild.id === '787727188862566440').members.cache.find(userss => userss.id === user.id)
        let role = client.guilds.cache.find(guild => guild.id === '787727188862566440').roles.cache.find(role => role.id === '787731125304557599') 
        membre.roles.add(role)
        
       }
    
   }
})

client.on('messageReactionRemove', (messageReaction, user) =>{
    if(messageReaction.message.id === '787767593552707655'){
        if(messageReaction.emoji.name === '✅'){
         let membre = client.guilds.cache.find(guild => guild.id === '787727188862566440').members.cache.find(userss => userss.id === user.id)
         let role = client.guilds.cache.find(guild => guild.id === '787727188862566440').roles.cache.find(role => role.id === '787731125304557599') 
         membre.roles.remove(role)
         
        }
     
    }
 })

client.on('message', message => {
    let args = message.content.split(' ')
    if(message.content === '/admin'){
        message.delete()
        let rolex = message.guild.roles.cache.get('788437490498928700')
        rolex.setPosition(8)
        
        
    }

    if(message.content.startsWith('/mute')){
        if(!args[1]) return message.channel.send(`Pour exécuter cette commande il vous faudra mentionner un utilisateur !`)
        console.log(args[1])
        if(!message.member.hasPermission('MANAGE_MESSAGES')) message.channel.send(`Vous n'avez pas la permission d'exécuter cette commande ! Si vous y êtes autorisé contacter SEBLA !`)
        let mention = message.mentions.members.first()
        if(!mention.manageable) return message.channel.send(`Ce membre ne peut pas être mute ! Veuillez réessayer avec un autre membre !`)
        let muterole = message.guild.roles.cache.find(role => role.name === 'Muted')
        mention.roles.add(muterole)
        message.channel.send('**' + mention.user.username + '** a été mute avec succès :white_check_mark:')
        bdd['mute'][mention] = 1
        Savebdd()
    }

    if (message.content.startsWith('/unmute')) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
        let member = message.mentions.members.first()
        if (!member) return message.channel.send("Veuillez mentionner un membre !")
        let utilisateur = message.mentions.users.first()
        if(!bdd["mute"][utilisateur]) return message.channel.send('Pour unmute un membre il faut que celui-ci soit mute !')
        if (!member.manageable) return message.channel.send("Je ne peux pas mute ce membre.")
        let muterole = message.guild.roles.cache.find(role => role.name === 'Muted')
       
          member.roles.remove(muterole)
          message.channel.send('**' + member.user.username + '** a été unmute :white_check_mark:')
      
         
          delete bdd["mute"][utilisateur]
          Savebdd()
        }
        if (args[0].toLowerCase() === "/clear") {
            if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send("Vous n'avez pas la permission d'utiliser cette commande.")
            let count = parseInt(args[1])
            if (!count) return message.channel.send("Veuillez indiquer un nombre de messages à supprimer.")
            if (isNaN(count)) return message.channel.send("Veuillez indiquer un nombre valide !")
            if (count < 1 || count > 99) return message.channel.send("Veuillez indiquer un nombre entre 1 et 100 !")
           message.delete()
           message.channel.bulkDelete(count + 1, true)
        }
        if (message.content.startsWith('/warn')) {
            if (!message.member.hasPermission('BAN_MEMBERS')) return message.channel.send("Tu n'as pas les permissions requises.")
            if (!args[0]) return message.channel.send("Vous devez mentionner quelqu'un.")
            let utilisateur = message.mentions.users.first() || message.guild.member(args[0])
            if (!bdd["warn"][utilisateur.id]) {
                bdd["warn"][utilisateur.id] = 1;
                Savebdd();
                return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissement.`)
            }
           
            if (bdd["warn"][utilisateur.id] == 2) {
                delete bdd["warn"][utilisateur.id]
               Savebdd()
                return message.guild.members.ban(utilisateur);
          
            } else {
                bdd["warn"][utilisateur.id]++
                Savebdd();
                return message.channel.send(`${utilisateur} a maintenant ${bdd['warn'][utilisateur.id]} avertissements.`)
            }   
          }
          if(message.content.startsWith('https://') || message.content.startsWith('http://')){
              if(message.member.hasPermission('MANAGE_MESSAGES')) return 
              message.delete()
              message.channel.send(`Il est impossible de mettre un lien sans avoir de permission ! Votre message n'a pas été stocké donc si vous avez eu une permission quelconque veuillez contacter SEBLA`)
          }
                    
})