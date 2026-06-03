import httpStatus from 'http-status';
import Meeting from '../models/meeting.model.js';
import ApiError from '../utils/ApiError.js';

// Create a new meeting
const createMeeting = async (meetingData, host) => {
  const meeting = await Meeting.create({
    ...meetingData,
    host: host.id,
    participants: [host.id]
  });
  return meeting;
};

// Get all meetings for a user
const getMeetings = async (userId) => {
  const meetings = await Meeting.find({
    $or: [{ host: userId }, { participants: userId }]
  })
    .populate('host', 'name email')
    .populate('participants', 'name email')
    .sort({ createdAt: -1 });
  return meetings;
};

// Get single meeting by ID
const getMeetingById = async (meetingId) => {
  const meeting = await Meeting.findById(meetingId)
    .populate('host', 'name email')
    .populate('participants', 'name email');
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Meeting not found');
  }
  return meeting;
};

// Get meeting by code (for joining)
const getMeetingByCode = async (meetingCode) => {
  const meeting = await Meeting.findOne({ meetingCode })
    .populate('host', 'name email')
    .populate('participants', 'name email');
  if (!meeting) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid meeting code');
  }
  return meeting;
};

// Update meeting
const updateMeeting = async (meetingId, updateData, userId) => {
  const meeting = await getMeetingById(meetingId);
  if (meeting.host.id !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only host can update meeting');
  }
  Object.assign(meeting, updateData);
  await meeting.save();
  return meeting;
};

// Delete meeting
const deleteMeeting = async (meetingId, userId) => {
  const meeting = await getMeetingById(meetingId);
  if (meeting.host.id !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only host can delete meeting');
  }
  await meeting.deleteOne();
};

// Join meeting
const joinMeeting = async (meetingCode, userId) => {
  const meeting = await getMeetingByCode(meetingCode);
  if (meeting.status === 'ended') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Meeting has already ended');
  }
  if (!meeting.participants.includes(userId)) {
    meeting.participants.push(userId);
    await meeting.save();
  }
  return meeting;
};

// Start meeting
const startMeeting = async (meetingId, userId) => {
  const meeting = await getMeetingById(meetingId);
  if (meeting.host.id !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only host can start meeting');
  }
  meeting.status = 'active';
  meeting.startTime = new Date();
  await meeting.save();
  return meeting;
};

// End meeting
const endMeeting = async (meetingId, userId) => {
  const meeting = await getMeetingById(meetingId);
  if (meeting.host.id !== userId.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Only host can end meeting');
  }
  meeting.status = 'ended';
  meeting.endTime = new Date();
  await meeting.save();
  return meeting;
};

export default {
  createMeeting,
  getMeetings,
  getMeetingById,
  getMeetingByCode,
  updateMeeting,
  deleteMeeting,
  joinMeeting,
  startMeeting,
  endMeeting
};
