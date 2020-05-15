const Discord = require("discord.js");
const fetch = require("node-fetch");
const translator = require("translate");

const { TOKEN } = require("./credentials.json");

const client = new Discord.Client();

const prefix = "°";

const dico = [
	["qui est le plus beau", "C'est Thibault bien sûr"],
	["que la passion te guides", "Mais quel référence magnifique, coeur sur toi poto <3"],
	["qu'aimes tu sur le serveur", "Oh ! J'adore surtout la Smehh créer par Urizox le grand(même si le best reste mon créateur vénéré: Dark_Account)"],
	["quel est le meilleur animé de tout les temps", "Un classement ne peut être effectué, tous les animés ont un potentiel et une histoire différente."],
];

const videos = require("./videos.json");

client.on("ready", () => {
	console.log(`Logged in as ${ client.user.tag }!`);
});

const getChatbotURL = (message, tag) => {
	const botID = 6589;
	const apiKey = "FZsmrJz1Sy0j76Ms";
	const userID = encodeURIComponent(tag);
	return  `http://api.brainshop.ai/get?bid=${ botID }&key=${ apiKey }&uid=${ userID }&msg=${ encodeURIComponent(message) }`;
}

const translate = async (msg, language) => {
	return msg;
	return await translator(msg, {
		to: language,
		engine: "yandex",
		key: "trnsl.1.1.20200508T204355Z.ad83d46435684bda.792bd3caca47bd388ca84608b1e696c8d97d2d21",
	});
}

const getUserFromMention = mention => {
	if (!mention)
		return false;
	if (mention.startsWith("<@") && mention.endsWith(">")) {
		mention = mention.slice(2, -1);
		if (mention.startsWith("!"))
			mention = mention.slice(1);
		return client.users.cache.get(mention);
	}
	return false;
}

client.on("message", msg => {
	(async () => {
		if (msg.author.tag === "Darkounet#5487")
			return;
		if (msg.content.substr(0, prefix.length) !== prefix)
			return;
		for (const d of dico) {
			if (msg.content.match(new RegExp(d[0], "i"))) {
				msg.reply(d[1]);
				return;
			}
		}
		for (const keyword in videos) {
			if (msg.content.substr(prefix.length, keyword.length) != keyword)
				continue;
			const user = msg.author;
			const suiteDuMessage = msg.content.substr(prefix.length + keyword.length + 1);
			let user2 = getUserFromMention(suiteDuMessage);
			if (suiteDuMessage == "random") {
				const memberList = [];
				msg.channel.members.forEach(function(member) {
					memberList.push(member.user);
				});
				user2 = memberList[Math.floor(Math.random() * memberList.length)];
			}
			let joke = "";
			if (user2) {
				joke = videos[keyword]["joke"]
				.replace(/\[user\]/g, user.username)
				.replace(/\[user2\]/g, user2.username);
			} else {
				joke = videos[keyword]["joke solo"]
				.replace(/\[user\]/g, user.username);
			}
			const links = videos[keyword].links;
			const link = links[Math.floor(Math.random() * links.length)];
			const embed = new Discord.MessageEmbed()
			.setColor("#FF00FF")
			.setTitle(joke)
			.setImage(link);
			msg.channel.send(embed);
			return;
		}
		const translatedInput = await translate(msg.content.substr(4), "en");
		const res = await fetch(getChatbotURL(translatedInput, msg.author.tag));
		const json = await res.json();
		const translatedOutput = await translate(json.cnt, "fr");
		msg.reply(translatedOutput);
	})()
	.catch(console.error);
});

client.login(TOKEN);
