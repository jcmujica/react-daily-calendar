import React, { useState, useEffect, useContext, useCallback } from 'react'
import { DateTime } from 'luxon';
import { CalendarContext } from '../../contexts/CalendarContext';
import { v4 as uuid } from 'uuid';
import { UserContext } from '../../contexts/UserContext';
import DateInput from '../DateInput/DateInput';

function Modal(props) {
  const { week } = props;
  const { columnHeight, events, setevents, activeEventId, setNewEvent, setactiveWeek, setActiveModal, modalMode } = useContext(CalendarContext);
  const { currentUser } = useContext(UserContext);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [modalEvent, setModalEvent] = useState({});
  const [deleteStage, setDeleteStage] = useState('');
  const [day, setDay] = useState([]);
  const [modalSelectedDate, setModalSelectedDate] = useState();
  const [dateChanged, setDateChanged] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    fields: [
      { label: 'Name', name: 'name', type: 'text', valueKey: 'name' },
      { label: 'Description', name: 'desc', type: 'textarea', valueKey: 'name' }
    ]
  });

  useEffect(() => {
    let startTimeRef = activeEventId
    if (modalMode === 'edit') {
      startTimeRef = events.filter((event) => event.id === activeEventId)[0].startTime;
    }
    let dayArray = [];
    for (let day in week) {
      dayArray = [...dayArray, week[day]]
    };
    let day = dayArray.filter((day) => day.includes(startTimeRef))
    if (day.length > 0) {
      day = day[0];
    }
    setDay(day);

    if (modalMode === 'create') {
      let startTime = activeEventId;
      setStartTime(activeEventId);
      setModalSelectedDate(activeEventId);
      let endTime = day[day.indexOf(activeEventId) + 1];
      setEndTime(endTime);

      setModalInfo({
        ...modalInfo,
        title: 'Create an event',
      });
      setModalEvent({
        id: uuid(),
        startTime: startTime,
        endTime: endTime,
        name: '',
        owner: currentUser,
        participants: [],
        resources: [],
        desc: '',
        height: columnHeight,
        color: currentUser.color,
        width: 90,
        seq: [startTime, endTime],
        yOffset: day.indexOf(startTime) * columnHeight,
        xOffset: 0,
        zIndex: 0
      });
    } else if (modalMode === 'edit') {
      setModalInfo({
        ...modalInfo,
        title: 'Edit this event',
      });
      let editEvent = { ...events[events.findIndex((el) => el.id === activeEventId)] }
      setStartTime(editEvent.startTime);
      setModalSelectedDate(editEvent.startTime);
      setEndTime(editEvent.endTime);
      setModalEvent({
        ...events[events.findIndex((el) => el.id === activeEventId)]
      });
    } else if (modalMode === 'delete') {
      setModalInfo({
        ...modalInfo,
        title: 'Are you sure you want to delete this entry?',
      });
    };
  }, []);

  useEffect(() => {
    if (dateChanged && modalSelectedDate) {
      setDateChanged(false);
      let selectedMillis = DateTime.fromFormat(modalSelectedDate, 'MM/dd/yyyy');
      setactiveWeek(selectedMillis.startOf('week'));
      setStartTime(selectedMillis.plus({ hours: extractTimeUnit(modalEvent.startTime, 'hour'), minutes: extractTimeUnit(modalEvent.startTime, 'minute') }).ts.toString());
      setEndTime(selectedMillis.plus({ hours: extractTimeUnit(modalEvent.endTime, 'hour'), minutes: extractTimeUnit(modalEvent.endTime, 'minute') }).ts.toString());
      let startTimeRef = selectedMillis.ts.toString();
      let dayArray = [];
      for (let day in week) {
        dayArray = [...dayArray, week[day]];
      };
      let day = dayArray.filter((day) => day.includes(startTimeRef));
      if (day.length > 0) {
        day = day[0];
      }
      setDay(day);
      let editEvent = { ...modalEvent };
      editEvent.startTime = startTime;
      editEvent.endTime = endTime;
      editEvent.seq = getSequence(startTime.toString(), endTime.toString(), day);

      setModalEvent({
        ...editEvent
      });
    }
  }, [dateChanged])

  const extractTimeUnit = (time, unit) => {
    return DateTime.fromMillis(parseInt(time))[unit];
  };

  const millisToString = (value) => {
    let input = value;
    if (typeof input === 'string') {
      input = parseInt(input);
    }
    let format = DateTime.fromMillis(parseInt(value)).toLocaleString(DateTime.TIME_24_SIMPLE).split(":");
    let first = format[0];
    let second = format[1];
    if (format[0].length < 2) {
      first = `0${first}`;
    }
    return `${first}:${second}`
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    setModalEvent({
      ...modalEvent,
      [name]: value
    });

  };

  const acceptModal = () => {
    let index = events.findIndex(obj => obj.id === activeEventId);
    if (modalMode === 'create') {
      let sequence = getSequence(startTime.toString(), endTime.toString(), day);
      let height = getHeight(sequence);
      let yOffset = getYOffset(startTime.toString(), day);
      let updModalEvent = {
        ...modalEvent,
        seq: sequence,
        height: height,
        yOffset: yOffset,
        startTime: startTime,
        endTime: endTime
      }

      setevents([
        ...events,
        updModalEvent
      ]);
    } else {
      let editEvent = modalEvent;
      let sequence = getSequence(startTime.toString(), endTime.toString(), day);
      let height = getHeight(sequence);
      let yOffset = getYOffset(startTime.toString(), day);
      let updEvents = [...events];
      editEvent.startTime = startTime.toString();
      editEvent.endTime = endTime.toString();
      editEvent.seq = sequence;
      editEvent.height = height;
      editEvent.yOffset = yOffset;

      updEvents[index] = editEvent;
      setevents([
        ...updEvents
      ]);
    }
    setNewEvent(true);
    setActiveModal(false);
  };

  const getSequence = (start, end, array) => {
    return array.slice(array.indexOf(start), array.indexOf(end) + 1)
  };

  const getHeight = (sequence) => {
    return (sequence.length - 1) * columnHeight;
  };

  const getYOffset = (start, array) => {
    return array.indexOf(start) * columnHeight;
  };

  const cancelModal = () => {
    setActiveModal(false);
    setDeleteStage('');
  };

  const deleteEvent = () => {
    if (!deleteStage) {
      setDeleteStage('confirm');
    } else {
      let filteredArray = events.filter((event) => event.id !== activeEventId);
      setevents([
        ...filteredArray
      ]);
      setDeleteStage('');
      setActiveModal(false);
    }
  };

  const handleStartTimeChange = useCallback((e) => {
    let startTime = e.target.value;
    setStartTime(startTime);
    if (startTime >= endTime) {
      setEndTime(day[day.findIndex((time) => time === startTime) + 1]);
    }
  }, [setStartTime, setEndTime]);

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const getDurationString = (start, end, array) => {
    let length = (getSequence(start, end, array).length - 1) * 15;
    let string = '';
    if (length / 60 < 1) {
      string = `${length} min`;
    } else {
      string = `${length / 60} hr`;
    }
    return string;
  };

  return (
    <>
      <div className="modal  is-active">
        <div className="modal-background"></div>
        <div className="modal-card calendar-modal">
          <header className="modal-card-head">
            <p className="modal-card-title">{modalInfo.title}</p>
            <button className="delete" aria-label="close" onClick={cancelModal}></button>
          </header>
          <section className="modal-card-body">
            {modalInfo.fields.length > 0 ? modalInfo.fields.map((field) =>
              (
                <div key={field.name} className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label">{field.label}</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control is-expanded" key={`control_${field.name}`}>
                        <input
                          className="input is-small"
                          type={field.type}
                          placeholder={field.label}
                          name={field.name}
                          value={modalEvent[field.name] || ''}
                          onChange={e => handleChange(e)}
                          required
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              )) : null}
            <div key="date" className="field is-horizontal">
              <div className="field-label is-small">
                <label className="label">On</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded" key={`control_day`}>
                    <DateInput
                      displayMode="dialog"
                      className="calendar-modal__datepicker"
                      modalSelectedDate={modalSelectedDate}
                      setModalSelectedDate={setModalSelectedDate}
                      dateChanged={dateChanged}
                      setDateChanged={setDateChanged}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div key="startTime" className="field is-horizontal">
              <div className="field-label is-small">
                <label className="label">From</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="select is-small is-fullwidth">
                    <select onChange={(e) => handleStartTimeChange(e)} value={startTime}>
                      {day.map((time, i) => (
                        i !== (day.length - 1) ?
                          <option
                            id={time}
                            key={time}
                            value={time}
                          >{millisToString(time)}
                          </option> : null)
                      )}
                    </select>
                  </div>
                </div>
                <div className="field-label is-small">
                  <label className="label">To</label>
                </div>
                <div className="field">
                  <div className="select is-small is-fullwidth">
                    <select onChange={(e) => handleEndTimeChange(e)} value={endTime} className="is-small">
                      {day.map((time) => (
                        time > startTime ?
                          <option
                            id={time}
                            key={time}
                            value={time}
                          >{`${millisToString(time)} (${getDurationString(startTime, time, day)})`}
                          </option> : null
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={acceptModal}>
              Submit
            </button>
            <button className="button" onClick={cancelModal}>Cancel</button>
            {modalMode === 'edit' ? <button className="button" style={deleteStage === 'confirm' ? { 'backgroundColor': '#C53030', 'color': 'white' } : null} onClick={deleteEvent}>
              {deleteStage === 'confirm' ? 'Confirm' : 'Delete'}
            </button> : null}
          </footer>
        </div>
      </div >
    </>
  )
};

export default Modal;
