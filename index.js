const Discord = require("discord.js");
const fetch = require("node-fetch");
const translator = require("translate");

const client = new Discord.Client();

const prefix = "°";

const dico = [
	["qui est le plus beau", "C'est Thibault bien sûr"],
	["que la passion te guides", "Mais quel référence magnifique, coeur sur toi poto <3"],
	["qu'aimes tu sur le serveur", "Oh ! J'adore surtout la Smehh créer par Urizox le grand(même si le best reste mon créateur vénéré: Dark_Account)"],
	["quel est le meilleur animé de tout les temps", "Un classement ne peut être effectué, tous les animés ont un potentiel et une histoire différente."],
];

const videos = {
	["run"]: {
		["joke"]: "[user] fuit [user2]",
		["links"]: [
			"https://media1.tenor.com/images/8f6323f71a398a806361d8c1e80bbcb3/tenor.gif?itemid=5501383",
			"https://i.pinimg.com/originals/0c/e8/be/0ce8bec2543d81ba65eefd309f0f0c5b.gif",
			"https://media.tenor.com/images/e78a3fc112f970ef795cc32fd69e6b08/tenor.gif",
			"https://media.tenor.com/images/2eab8c295065b3113e0ceb9426d37238/tenor.gif",
			"https://media.tenor.com/images/68c99b6935333cfb6ae550e4282fe39e/tenor.gif",
			"https://media.tenor.com/images/f5079a48e1b68f7b16a3dea5bd484f59/tenor.gif",
			"https://media.tenor.com/images/0b3eb0dbdbbb0b735bcd16935138e64a/tenor.gif",
			"https://media.tenor.com/images/7a2ab7bd487ef2f0da1ec8d711c75acc/tenor.gif",
			"https://media1.tenor.com/images/879fbfa179c7b510f21743e1a19f0de6/tenor.gif?itemid=11115606",
			"https://tenor.com/0Obn.gif",
		],
	},
	["kiss"]: {
		["joke"]: "[user] embrasse [user2]",
		"links": [
			"https://media.tenor.com/images/a6052b4b3da2cb545467f7b499935c40/tenor.gif",
			"https://media.tenor.com/images/fbb2b4d5c673ffcf8ec35e4652084c2a/tenor.gif",
			"https://media.tenor.com/images/9fb52dbfd3b7695ae50dfd00f5d241f7/tenor.gif",
			"https://images-ext-2.discordapp.net/external/dMuL1QWAmMnktxtoS4axRN0g_is0B_WiTpU6t0k85pQ/https/cdn.weeb.sh/images/SJ--2auDZ.gif",
			"https://images-ext-1.discordapp.net/external/VwAQGyZB6YuWmhKvLsZ0SfQPCRYA1dhpgyq_iFzH8PQ/https/cdn.weeb.sh/images/Byh57gqkz.gif",
			"https://images-ext-2.discordapp.net/external/auznSk7yqtg_M2wKmlNW-BsyE2-kY9fEeH572pQSZ1Y/https/cdn.weeb.sh/images/B1yv36_PZ.gif",
			"https://images-ext-1.discordapp.net/external/_GpwSBCIUeqBHpvR5Cp-zfZ3W1GGlkadNxs5OQoYW2Y/https/cdn.weeb.sh/images/Skv72TuPW.gif",
			"https://media1.tenor.com/images/850566838b3cff99dc2e66a91bcfdeb8/tenor.gif?itemid=12769470",
			"https://media1.tenor.com/images/ab43498e7dd463433360b16ea886bb9d/tenor.gif?itemid=15633093",
			"https://media.tenor.com/images/2138a26729b69880bed732dc30fe93b2/tenor.gif",
			"https://gifs.luscious.net/admin/277900/2_01B3ZHS8JSEH84PNSQ8P0YTSB7.gif",
			"https://media1.tenor.com/images/105a7ad7edbe74e5ca834348025cc650/tenor.gif?itemid=9158317",
			"https://media.tenor.com/images/dc16e8164f2686c786a1091df47c9f3c/tenor.gif",
			"https://media1.tenor.com/images/91a00e35f1a11a78dfd4bb1f1399fa90/tenor.gif?itemid=14698604",
		],
	},
};

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
		if (msg.content.substr(0, prefix.length + 1) !== prefix + " ")
			return;
		for (const d of dico) {
			if (msg.content.match(new RegExp(d[0], "i"))) {
				msg.reply(d[1]);
				return;
			}
		}
		for (const keyword in videos) {
			if (msg.content.substr(prefix.length + 1, keyword.length + 1) != keyword + " ")
				continue;
			const user = msg.author.username;
			const user2Mention = msg.content.substr(prefix.length + 2 + keyword.length);
			let user2 = getUserFromMention(user2Mention);
			if (!user2)
				user2 = "Darkounet";
			else
				user2 = user2.username;
			const joke = videos[keyword].joke
			.replace(/\[user\]/g, user)
			.replace(/\[user2\]/g, user2);
			const links = videos[keyword].links;
			const randomIndex = Math.floor(Math.random() * links.length);
			const link = links[randomIndex];
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

client.login("NzA4Mzk0MzE5NDQ2NDA5Mjc3.XrWtug.tjOPRTVAn4sjiCUxT3Wd3NCKfhE");
