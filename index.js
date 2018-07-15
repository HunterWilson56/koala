const Discord = require('discord.js');  
const snekfetch = require('snekfetch');
const client = new Discord.Client();
const Canvas = require('canvas');




//command handler would g



const applyText = (canvas, text) => {
  const ctx = canvas.getContext('2d');

  // Declare a base size of the font
  let fontSize = 70;

  do {
      // Assign the font to the context and decrement it so it can be measured again
      ctx.font = `${fontSize -= 10}px sans-serif`;
      // Compare pixel width of the text to the canvas minus the approximate avatar size
  } while (ctx.measureText(text).width > canvas.width - 300);

  // Return the result to use in the actual canvas
  return ctx.font;
};

client.on('guildMemberAdd', async member => {
  const channel = member.guild.channels.find(ch => ch.name === 'member-log');
  if (!channel) return;
   

  const canvas = Canvas.createCanvas(700, 250);
  const ctx = canvas.getContext('2d');

  const background = await Canvas.loadImage('./SXWelcome_Banner.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#74037b';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Slightly smaller text placed above the member's display name
  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#FFFFF';
  //ctx.fillText('', canvas.width / 2.5, canvas.height / 3.5);

  // Add an exclamation point here and below
  ctx.font = applyText(canvas, `${member.displayName}!`);
  ctx.fillStyle = '#ffffff';
  //ctx.fillText(`${member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);

  ctx.beginPath();
  ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  const { body: buffer } = await snekfetch.get(member.user.displayAvatarURL);
  const avatar = await Canvas.loadImage(buffer);
  ctx.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-card.png');

  //channel.send(`Welcome to the server, ${member}!`, attachment);
    let embed = new Discord.RichEmbed()
    .setTitle("Hello!")
    .setDescription(`Welcome!, ${member}`)
   
    channel.send(embed);
    channel.send(attachment)
  
});



client.on('message', async message => {
  if (message.content === '!le') {
      client.emit('guildMemberRemove', message.member || await message.guild.fetchMember(message.author));
  }
});


client.on('message', async message => {
  if (message.content === '!join') {
      client.emit('guildMemberAdd', message.member || await message.guild.fetchMember(message.author));
  }
});

client.on("ready", function() {
  var clientonmessage = `
------------------------------------------------------
> Logging in...
------------------------------------------------------
Logged in as ${client.user.tag}
Working on ${client.guilds.size} servers!
${client.channels.size} channels and ${client.users.size} users cached!
I am logged in and ready to roll!
LET'S GO!
------------------------------------------------------
----------Bot created by Tea Cup#3433-----------
------------------------------------------------------
-----------------Bot's commands logs------------------`
  console.log(clientonmessage);



});
client.login(process.env.TOKEN);
