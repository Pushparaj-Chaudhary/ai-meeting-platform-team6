import express from 'express';
import auth from '../../middlewares/auth.js';
import validate from '../../middlewares/validate.js';
import meetingValidation from '../../validations/meeting.validation.js';
import meetingController from '../../controllers/meeting.controller.js';

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(meetingValidation.createMeeting), meetingController.createMeeting)
  .get(auth(), meetingController.getMeetings);

router
  .route('/:meetingId')
  .get(auth(), validate(meetingValidation.meetingId), meetingController.getMeeting)
  .patch(auth(), validate(meetingValidation.updateMeeting), meetingController.updateMeeting)
  .delete(auth(), validate(meetingValidation.meetingId), meetingController.deleteMeeting);

router.post('/join', auth(), validate(meetingValidation.joinMeeting), meetingController.joinMeeting);
router.post('/:meetingId/start', auth(), validate(meetingValidation.meetingId), meetingController.startMeeting);
router.post('/:meetingId/end', auth(), validate(meetingValidation.meetingId), meetingController.endMeeting);

export default router;
