import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync.js';
import meetingService from '../services/meeting.service.js';

const createMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.createMeeting(req.body, req.user);
  res.status(httpStatus.CREATED).json(meeting);
});

const getMeetings = catchAsync(async (req, res) => {
  const meetings = await meetingService.getMeetings(req.user.id);
  res.status(httpStatus.OK).json(meetings);
});

const getMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.getMeetingById(req.params.meetingId);
  res.status(httpStatus.OK).json(meeting);
});

const updateMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.updateMeeting(
    req.params.meetingId,
    req.body,
    req.user.id
  );
  res.status(httpStatus.OK).json(meeting);
});

const deleteMeeting = catchAsync(async (req, res) => {
  await meetingService.deleteMeeting(req.params.meetingId, req.user.id);
  res.status(httpStatus.NO_CONTENT).send();
});

const joinMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.joinMeeting(
    req.body.meetingCode,
    req.user.id
  );
  res.status(httpStatus.OK).json(meeting);
});

const startMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.startMeeting(
    req.params.meetingId,
    req.user.id
  );
  res.status(httpStatus.OK).json(meeting);
});

const endMeeting = catchAsync(async (req, res) => {
  const meeting = await meetingService.endMeeting(
    req.params.meetingId,
    req.user.id
  );
  res.status(httpStatus.OK).json(meeting);
});

export default {
  createMeeting,
  getMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
  startMeeting,
  endMeeting
};
