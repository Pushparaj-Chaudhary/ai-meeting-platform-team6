import Joi from 'joi';

const createMeeting = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    scheduledTime: Joi.date()
  })
};

const updateMeeting = {
  params: Joi.object().keys({
    meetingId: Joi.string().required()
  }),
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string().allow(''),
    scheduledTime: Joi.date()
  })
};

const joinMeeting = {
  body: Joi.object().keys({
    meetingCode: Joi.string().required()
  })
};

const meetingId = {
  params: Joi.object().keys({
    meetingId: Joi.string().required()
  })
};

export default { createMeeting, updateMeeting, joinMeeting, meetingId };
