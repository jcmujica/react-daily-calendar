import React, { useState, useEffect, useContext, useRef, createRef } from 'react'
import { DateTime } from 'luxon';
import { CalendarContext } from '../../contexts/CalendarContext';
import { v4 as uuid } from 'uuid';
import { UserContext } from '../../contexts/UserContext';

function Modal(props) {
  const { duration, active, modalMode, week } = props;
  const { columnHeight, events, setevents, activeEventId, setNewEvent, timeRange } = useContext(CalendarContext);
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser } = useContext(UserContext);

  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [modalEvent, setModalEvent] = useState({});
  const [startOfDay, setStartOfDay] = useState();
  const [deleteStage, setDeleteStage] = useState('');
  const [day, setDay] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    fields: [
      { label: 'Name', name: 'name', type: 'text', valueKey: 'name' },
      { label: 'Description', name: 'desc', type: 'text', valueKey: 'name' }
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
      setStartTime(activeEventId)
      setStartOfDay(DateTime.fromMillis(parseInt(startTime)).startOf("day"));
      let endTime = day[day.indexOf(activeEventId) + 1];
      setEndTime(endTime)

      setModalInfo({
        ...modalInfo,
        title: 'Please enter the required information',
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
        title: 'Please edit the required information',
      });
      let editEvent = { ...events[events.findIndex((el) => el.id === activeEventId)] }
      setStartTime(editEvent.startTime);
      setStartOfDay(DateTime.fromMillis(parseInt(editEvent.startTime)).startOf("day"));
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

  const preFormatTime = (value) => {
    let format = DateTime.fromMillis(parseInt(value)).toLocaleString(DateTime.TIME_24_SIMPLE).split(":");
    let first = format[0];
    let second = format[1];
    if (format[0].length < 2) {
      first = `0${first}`;
    }
    return `${first}:${second}`
  };

  const handleChange = (e) => {
    let { name, value, type } = e.target;

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
    active(false);
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
    active(false);
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
      active(false);
    }
  };

  const handleTimeChange = (e) => {
    let field = e.target;
    let newStartTime;
    let newEndTime;
    if (field.value) {
      if (field.id === "startTime") {
        newStartTime = DateTime.fromMillis(timeToDateTime(field.value));
        newEndTime = DateTime.fromMillis(parseInt(endTime));
        if (newStartTime >= newEndTime) {
        } else {
          setStartTime(timeToDateTime(field.value));
        }
      } else if (field.id === "endTime") {
        newEndTime = DateTime.fromMillis(timeToDateTime(field.value));
        newStartTime = DateTime.fromMillis(parseInt(startTime));
        if (newEndTime <= newStartTime) {
        } else {
          setEndTime(timeToDateTime(field.value));
        }
      }
    }
  };

  const timeToDateTime = (time) => {
    return startOfDay.plus({ hours: parseInt(time.split(':')[0]), minutes: parseInt(time.split(':')[1]) }).ts;
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
                        ></input>
                      </div>
                    </div>
                  </div>
                </div>
              )) : null}

            <div key="startTime" className="field is-horizontal">
              <div className="field-label is-small">
                <label className="label">Start time</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded" key={`control_startTime`}>
                    <input
                      value={preFormatTime(startTime)}
                      id="startTime"
                      type="time"
                      step={15 * 60}
                      onChange={handleTimeChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div key="endTime" className="field is-horizontal">
              <div className="field-label is-small">
                <label className="label">End time</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded" key={`control_endTime`}>
                    <input
                      value={preFormatTime(endTime)}
                      id="endTime"
                      type="time"
                      step={15 * 60}
                      onChange={handleTimeChange}
                    />
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
            {modalMode === 'edit' ? <button className="button" onClick={deleteEvent}>
              {deleteStage === 'confirm' ? 'Confirm' : 'Delete'}
            </button> : null}
          </footer>
        </div>
      </div >
    </>
  )
};

export default Modal;
