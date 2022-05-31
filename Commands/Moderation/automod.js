/**
 * Author: Amit Kumar
 * Github: https://github.com/AmitKumarHQ
 * Created On: 10th April 2022
 * Last Modified On: 31th May 2022
 */

const { CommandInteraction, MessageEmbed, Client } = require("discord.js");
const DB = require("../../Structures/Schemas/ModerationDB");

module.exports = {
	name: "automod",
	usage: "/automod",
	description: "AI Based Moderation System",
	permission: ["MANAGE_GUILD"],
	options: [
		{
			name: "channel",
			description: "Channels To Use Automod",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "add",
					description: "Add Channel For Automod",
					type: "SUB_COMMAND",
					options: [
						{
							name: "channel",
							description: "The Channel For Automod",
							type: "CHANNEL",
							channelTypes: ["GUILD_TEXT"],
							required: true,
						},
					],
				},
				{
					name: "remove",
					description: "Remove Channel For Automod",
					type: "SUB_COMMAND",
					options: [
						{
							name: "channel",
							description: "The Channel For Automod",
							type: "CHANNEL",
							channelTypes: ["GUILD_TEXT"],
							required: true,
						},
					],
				},
			],
		},
		{
			name: "bypass",
			description: "Configure Automod Bypass",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "add",
					description: "Add Users/Roles To Automod Bypass",
					type: "SUB_COMMAND",
					options: [
						{
							name: "user",
							description: "Add User To Automod Bypass",
							type: "USER",
							required: false,
						},
						{
							name: "role",
							description: "Add Role To Automod Bypass",
							type: "ROLE",
							required: false,
						},
					],
				},
				{
					name: "remove",
					description: "Remove Users/Roles From Automod Bypass",
					type: "SUB_COMMAND",
					options: [
						{
							name: "user",
							description: "Remove User From Automod Bypass",
							type: "USER",
							required: false,
						},
						{
							name: "role",
							description: "Remove Role From Automod Bypass",
							type: "ROLE",
							required: false,
						},
					],
				},
			],
		},
		{
			name: "log",
			description: "Configure Automod Logging Channels",
			type: "SUB_COMMAND_GROUP",
			options: [
				{
					name: "add",
					description: "Add Channel To Automod Logging",
					type: "SUB_COMMAND",
					options: [
						{
							name: "channel",
							description: "The Channel For Automod Logging",
							type: "CHANNEL",
							channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
							required: false,
						},
					],
				},
				{
					name: "remove",
					description: "Remove Channel From Automod Logging",
					type: "SUB_COMMAND",
					options: [
						{
							name: "channel",
							description: "The Channel For Automod Logging",
							type: "CHANNEL",
							channelTypes: ["GUILD_TEXT", "GUILD_NEWS"],
							required: false,
						},
					],
				},
			],
		},
		{
			name: "list",
			description: "Show All Automod Settings",
			type: "SUB_COMMAND",
		},
		{
			name: "punishments",
			description: "Configure Automod Punishments",
			type: "SUB_COMMAND",
			options: [
				{
					name: "low",
					description: "Set Low Severity Punishment",
					type: "STRING",
					required: true,
					choices: [
						{
							name: "Delete",
							value: "delete",
						},
						{
							name: "Timeout",
							value: "timeout",
						},
						{
							name: "Kick",
							value: "kick",
						},
						{
							name: "Ban",
							value: "ban",
						},
					],
				},
				{
					name: "medium",
					description: "Set Medium Severity Punishment",
					type: "STRING",
					required: true,
					choices: [
						{
							name: "Delete",
							value: "delete",
						},
						{
							name: "Timeout",
							value: "timeout",
						},
						{
							name: "Kick",
							value: "kick",
						},
						{
							name: "Ban",
							value: "ban",
						},
					],
				},
				{
					name: "high",
					description: "Set High Severity Punishment",
					type: "STRING",
					required: true,
					choices: [
						{
							name: "Delete",
							value: "delete",
						},
						{
							name: "Timeout",
							value: "timeout",
						},
						{
							name: "Kick",
							value: "kick",
						},
						{
							name: "Ban",
							value: "ban",
						},
					],
				},
			],
		},
	],

	/**
	 * @param {Client} client
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
		const { options, guild, channel } = interaction;

		// A Function To Remove Single Value From Array
		function removeOne(arr, value) {
			var index = arr.indexOf(value);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		}

		switch (options.getSubcommand()) {
			case "add":
				{
					switch (options.getSubcommandGroup()) {
						case "channel":
							{
								const channel = options.getChannel("channel");

								DB.findOne({ GuildID: guild.id }).then(
									async function (docs) {
										if (!docs) {
											await DB.create({
												GuildID: guild.id,
												ChannelIDs: channel.id,
											});
										} else if (
											docs &&
											docs.ChannelIDs.includes(channel.id)
										) {
											return interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("RED")
														.setDescription(
															`${channel} Is Already In The Automod Channels`
														),
												],
												ephemeral: true,
											});
										}

										docs.ChannelIDs.push(channel.id);
										await docs.save();

										await interaction.reply({
											embeds: [
												new MessageEmbed()
													.setColor("GREEN")
													.setDescription(
														`${channel} Has Been Added to the Automod Channels`
													),
											],
											ephemeral: true,
										});
									},
									async function (err) {
										console.log(err);
									}
								);
							}
							break;

						case "bypass":
							{
								const addUser = options.getUser("user");
								const addRole = options.getRole("role");

								if (addUser) {
									await DB.findOne({
										GuildID: guild.id,
									}).then(
										async function (docs) {
											if (!docs) {
												await DB.create({
													GuildID: guild.id,
													BypassUsers: addUser.id,
												});
											} else if (
												docs &&
												docs.BypassUsers.includes(
													addUser.id
												)
											) {
												return interaction.reply({
													embeds: [
														new MessageEmbed()
															.setColor("RED")
															.setDescription(
																`${addUser} Is Already In The Automod Bypass List`
															),
													],
													ephemeral: true,
												});
											} else {
												docs.BypassUsers.push(
													addUser.id
												);
												await docs.save();
											}

											await interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("GREEN")
														.setDescription(
															`${addUser} Has Been Added to the Automod Bypass List`
														),
												],
												ephemeral: true,
											});
										},
										async function (err) {
											console.log(err);
										}
									);
								} else if (addRole) {
									await DB.findOne({
										GuildID: guild.id,
									}).then(
										async function (docs) {
											if (!docs) {
												await DB.create({
													GuildID: guild.id,
													BypassRoles: addRole.id,
												});
											} else if (
												docs &&
												docs.BypassRoles.includes(
													addRole.id
												)
											) {
												return interaction.reply({
													embeds: [
														new MessageEmbed()
															.setColor("RED")
															.setDescription(
																`${addRole} Is Already In The Automod Bypass List`
															),
													],
													ephemeral: true,
												});
											}

											docs.BypassRoles.push(addRole.id);
											await docs.save();

											await interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("GREEN")
														.setDescription(
															`${addRole} Has Been Added to the Automod Bypass List`
														),
												],
												ephemeral: true,
											});
										},
										async function (err) {
											console.log(err);
										}
									);
								} else {
									return interaction.reply({
										embeds: [
											new MessageEmbed()
												.setColor("RED")
												.setTitle(
													"🛑 Invalid Arguments"
												)
												.setDescription(
													`Please Provide A User/Role To Add To The Automod Bypass List`
												),
										],
										ephemeral: true,
									});
								}
							}
							break;

						case "log": {
							const addChannel = options.getChannel("channel");

							await DB.findOne({
								GuildID: guild.id,
							}).then(
								async function (docs) {
									if (!docs) {
										await DB.create({
											GuildID: guild.id,
											LogChannelIDs: addChannel.id,
										});
									} else if (
										docs &&
										docs.LogChannelIDs.includes(
											addChannel.id
										)
									) {
										return interaction.reply({
											embeds: [
												new MessageEmbed()
													.setColor("RED")
													.setDescription(
														`${addChannel} Is Already In The Automod Logging Channels`
													),
											],
											ephemeral: true,
										});
									}

									docs.LogChannelIDs.push(addChannel.id);
									await docs.save();

									await interaction.reply({
										embeds: [
											new MessageEmbed()
												.setColor("GREEN")
												.setDescription(
													`${addChannel} Has Been Added to the Automod Logging Channels`
												),
										],
										ephemeral: true,
									});
								},
								async function (err) {
									console.log(err);
								}
							);
						}
					}
				}
				break;

			case "remove":
				{
					switch (options.getSubcommandGroup()) {
						case "channel":
							{
								const channel = options.getChannel("channel");

								await DB.findOne({ GuildID: guild.id }).then(
									async function (docs) {
										if (!docs || !docs.ChannelIDs[0]) {
											return interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("RED")
														.setTitle(
															"🛑 Automod Not Configured!"
														)
														.setDescription(
															`Please Configure Automod First
											 Use \`/automod channel add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
											 `
														),
												],
												ephemeral: true,
											});
										} else if (
											docs &&
											!docs.ChannelIDs.includes(
												channel.id
											)
										) {
											return interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("RED")
														.setDescription(
															`${channel} Is Not in the Automod Channels`
														),
												],
												ephemeral: true,
											});
										}

										docs.ChannelIDs.remove(channel.id);
										await docs.save();

										await interaction.reply({
											embeds: [
												new MessageEmbed()
													.setColor("GREEN")
													.setDescription(
														`${channel} Has Been Removed to the Automod Channels`
													),
											],
											ephemeral: true,
										});
									},
									async function (err) {
										console.log(err);
									}
								);
							}
							break;

						case "bypass":
							{
								const removeUser = options.getUser("user");
								const removeRole = options.getRole("role");

								if (removeUser) {
									await DB.findOne({
										GuildID: guild.id,
									}).then(
										async function (docs) {
											if (!docs) {
												return interaction.reply({
													embeds: [
														new MessageEmbed()
															.setColor("RED")
															.setTitle(
																"🛑 Automod Not Configured!"
															)
															.setDescription(
																`Please Configure Automod First Use \`/automod channel add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod`
															),
													],
													ephemeral: true,
												});
											} else if (docs) {
												if (
													!docs.BypassUsers.includes(
														removeUser.id
													)
												) {
													return interaction.reply({
														embeds: [
															new MessageEmbed()
																.setColor("RED")
																.setDescription(
																	`${removeUser} Is Not In The Automod Bypass List`
																),
														],
														ephemeral: true,
													});
												}
											}

											docs.BypassUsers = removeOne(
												docs.BypassUsers,
												removeUser.id
											);
											await docs.save();

											return interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("GREEN")
														.setDescription(
															`${removeUser} Has Been Removed From the Automod Bypass List`
														),
												],
												ephemeral: true,
											});
										},
										async function (err) {
											console.log(err);
										}
									);
								} else if (removeRole) {
									await DB.findOne({
										GuildID: guild.id,
									}).then(
										async function (docs) {
											if (!docs || !docs.BypassRoles[0]) {
												return interaction.reply({
													embeds: [
														new MessageEmbed()
															.setColor("RED")
															.setTitle(
																"🛑 Automod Not Configured!"
															)
															.setDescription(
																`Please Configure Automod First
											 Use \`/automod channel add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
											 `
															),
													],
													ephemeral: true,
												});
											} else if (
												docs &&
												!docs.BypassRoles.includes(
													removeRole.id
												)
											) {
												return interaction.reply({
													embeds: [
														new MessageEmbed()
															.setColor("RED")
															.setDescription(
																`${removeRole} Is Not In The Automod Bypass List`
															),
													],
													ephemeral: true,
												});
											}

											docs.BypassRoles = removeOne(
												docs.BypassRoles,
												removeRole.id
											);
											await docs.save();

											return interaction.reply({
												embeds: [
													new MessageEmbed()
														.setColor("GREEN")
														.setDescription(
															`${removeRole} Has Been Removed From the Automod Bypass List`
														),
												],
												ephemeral: true,
											});
										},
										async function (err) {
											console.log(err);
										}
									);
								}
							}
							break;

						case "log": {
							const removeChannel = options.getChannel("channel");

							await DB.findOne({
								GuildID: guild.id,
							}).then(
								async function (docs) {
									if (!docs || !docs.LogChannelIDs[0]) {
										return interaction.reply({
											embeds: [
												new MessageEmbed()
													.setColor("RED")
													.setTitle(
														"🛑 Automod Not Configured!"
													)
													.setDescription(
														`Please Configure Automod First
									 Use \`/automod channel add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
									 `
													),
											],
											ephemeral: true,
										});
									} else if (
										docs &&
										!docs.LogChannelIDs.includes(
											removeChannel.id
										)
									) {
										return interaction.reply({
											embeds: [
												new MessageEmbed()
													.setColor("RED")
													.setDescription(
														`${removeChannel} Is Not in the Automod Logging Channels`
													),
											],
											ephemeral: true,
										});
									}

									docs.LogChannelIDs = removeOne(
										docs.LogChannelIDs,
										removeChannel.id
									);
									await docs.save();

									return interaction.reply({
										embeds: [
											new MessageEmbed()
												.setColor("GREEN")
												.setDescription(
													`${removeChannel} Has Been Removed to the Automod Logging Channels`
												),
										],
										ephemeral: true,
									});
								},
								async function (err) {
									console.log(err);
								}
							);
						}
					}
				}
				break;

			case "list":
				{
					const ChannelIDs = [];
					const LogChannelIDs = [];
					const BypassUsers = [];
					const BypassRoles = [];

					DB.findOne(
						{
							GuildID: guild.id,
						},
						async (err, docs) => {
							if (err) console.log(err);

							if (!docs || !docs.ChannelIDs[0]) {
								return interaction.reply({
									embeds: [
										new MessageEmbed()
											.setColor("RED")
											.setTitle(
												"🛑 Automod Not Configured!"
											)
											.setDescription(
												`Please Configure Automod First
									 Use \`/automod channel add\`, \`/automod log\` & \`/automod punishments\` To Configure Automod
									 `
											),
									],
									ephemeral: true,
								});
							}

							await docs.ChannelIDs.forEach(async (c) => {
								const channel = await client.channels.fetch(c);
								ChannelIDs.push(channel);
							});

							await docs.LogChannelIDs.forEach(async (c) => {
								const channel = await client.channels.fetch(c);
								LogChannelIDs.push(channel);
							});

							await docs.BypassUsers.forEach(async (u) => {
								const user = await client.users.fetch(u);
								BypassUsers.push(user);
							});

							await docs.BypassRoles.forEach(async (r) => {
								const role = await guild.roles.fetch(r);
								BypassRoles.push(role);
							});

							interaction.reply({
								embeds: [
									new MessageEmbed()
										.setColor("GREEN")
										.setTitle(`Automod Configuration`)
										.addFields(
											{
												name: "<:icon_reply:962547429914337300> Channels",
												value: `${
													ChannelIDs.join("\n") ||
													"Not Provided Yet"
												}
								 ㅤ
								 `,
												inline: false,
											},
											{
												name: "<:icon_reply:962547429914337300> Punishments",
												value: `\`•\` Low Severity: ${
													docs.Punishments[0] ||
													"Not Provided Yet"
												}
								 \`•\` Medium Severity: ${docs.Punishments[1] || "Not Provided Yet"}
								 \`•\` High Severity: ${docs.Punishments[2] || "Not Provided Yet"}
								 ㅤ
								 `,
												inline: false,
											},
											{
												name: "<:icon_reply:962547429914337300> Logging Channels",
												value: `${
													LogChannelIDs.join("\n") ||
													"Not Provided Yet"
												}
								 ㅤ
								 `,
												inline: false,
											}
										),
								],
								ephemeral: true,
							});
						}
					);
				}
				break;

			case "punishments":
				{
					const low = options.getString("low");
					const medium = options.getString("medium");
					const high = options.getString("high");

					const docs = await DB.findOneAndUpdate(
						{
							GuildID: guild.id,
						},
						{
							Punishments: [low, medium, high],
						},
						{
							new: true,
							upsert: true,
						}
					);

					interaction.reply({
						embeds: [
							new MessageEmbed()
								.setColor("GREEN")
								.setTitle(`Automod Punishments`)
								.setDescription(
									`**Low Severity**: ${docs.Punishments[0]}
							 **Medium Severity**: ${docs.Punishments[1]}
							 **High Severity**: ${docs.Punishments[2]}
							 `
								),
						],
						ephemeral: true,
					});
				}
				break;
		}
	},
};
