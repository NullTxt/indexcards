import { getFollowers } from '../../../helpers/followers.js';
import { emailBlast } from '../../../helpers/mail.js';

const sendShareFile = {
	POST: async (req, res) => {

		const roomNames = req.body?.panels?.map((room) => room.toLowerCase());

		const sections = await req.db.sequelize.query(`
			select
				panel.id sectionId, panel.letter sectionLetter,
				round.id roundId, round.name roundName, round.label roundLabel,
				tourn.id tournId, tourn.name tournName,
				room.name room, share.value phrase
				from (round, event, tourn, panel, panel_setting share)
					left join room on room.id = panel.room
			where LOWER(share.value) IN (:roomNames)
				and share.tag = 'share'
				and share.panel = panel.id
				and panel.round = round.id
				and round.event = event.id
				and event.tourn = tourn.id
				and tourn.start < NOW()
				and tourn.end > NOW()
		`, {
			replacements: { roomNames },
			type: req.db.Sequelize.QueryTypes.SELECT,
		});

		if (!sections || sections.length < 1) {
			return res.status(400).json(`No section found for codenames ${req.body.panels}`);
		}

		let counter = 0;
		const emailPromises = [];

		for (const section of sections) {

			// eslint-disable-next-line no-await-in-loop
			const email = await getFollowers({
				sectionId        : section.sectionId,
				noFollowers      : true,
				sectionFollowers : true,
				returnEmails     : true,
			});

			if (!email || email.length < 1) {
				return false;
			}

			let messageText = `Share speech documents for this round (10mb limit, docs only) by replying to`;
			messageText += ` this email with a file attachment, or going to https://share.tabroom.com/${section.phrase} \n`;

			let messageHTML = `<p>Share speech documents for this round (10mb limit, docs only) by replying to`;
			messageHTML += ` this email with a file attachment, or going to `;
			messageHTML += `<a href="https://share.tabroom.com/${section.phrase}">https://share.tabroom.com/${section.phrase}</a></p>`;

			const messageData = {
				to      : `${section.phrase}@share.tabroom.com`,
				subject : `${section.tournName} ${section.roundLabel || `Round ${section.roundName}`} (${section.phrase}) - Speech Documents`,
				text    : messageText,
				html    : messageHTML,
				share   : true,
				email,
				attachments : req.body.files || [],
			};

			if (messageData.email.length > 0) {
				const dispatch = emailBlast(messageData);
				counter += email.length;
				emailPromises.push(dispatch.result);
			}
		}

		if (emailPromises.length < 1) {
			return res.status(400).json('No emails found, nothing to send');
		}

		await Promise.all(emailPromises);
		return res.status(201).json({ message: `Successfully sent speech doc emails to ${counter} recipients` });
	},
};

sendShareFile.POST.apiDoc = {
	summary: 'Sends a document to the docchain email list for a room',
	operationId: 'sendShareFile',
	requestBody: {
		description : 'Initialize the doc chain room and emails',
		required    : true,
		content: { '*/*': { schema: { $ref: '#/components/schemas/Share' } } },
	},
	responses: {
		201: {
			description: 'Success',
			content: {
				'*/*': {
					schema: {
						type: 'string',
					},
				},
			},
		},
		default: { $ref: '#/components/responses/ErrorResponse' },
	},
	tags: ['share'],
};

export default sendShareFile;
