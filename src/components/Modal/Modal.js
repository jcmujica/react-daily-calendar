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
  const [prevEndTime, setPrevEndTime] = useState('');
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
      setStartTime(activeEventId)
      setStartOfDay(DateTime.fromMillis(parseInt(startTime)).startOf("day"));
      let endTime = day[day.indexOf(activeEventId) + 1];
      setEndTime(endTime)

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

      console.log('startTime', typeof startTime)
      console.log('endtTime', typeof endTime)
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
    let inputTime = e.target.value

    if (inputTime) {
      if (field.id === "startTime") {
        newStartTime = DateTime.fromMillis(timeToDateTime(inputTime));
        newEndTime = DateTime.fromMillis(parseInt(endTime));
        let s_endTime = DateTime.fromMillis(parseInt(endTime)).toLocaleString(DateTime.TIME_24_SIMPLE);
        let s_startTime = DateTime.fromMillis(parseInt(startTime)).toLocaleString(DateTime.TIME_24_SIMPLE);
        if (s_endTime.split(':')[0].length < 2) {
          s_endTime = `0${s_endTime}`;
        }
        if (newStartTime >= newEndTime) {
          if (DateTime.fromMillis(parseInt(startTime)).toLocaleString(DateTime.TIME_24_SIMPLE).split(':')[0] === '12') {
            setStartTime(timeToDateTime(`11:${inputTime.split(':')[1]}`));
          }
        } else {
          let hour = inputTime.split(':')[0];
          let fullMinutes = inputTime.split(':')[1];
          let lastDigit = parseInt(fullMinutes.split('')[1]);
          fullMinutes = parseInt(fullMinutes);

          if (fullMinutes === 45 || (lastDigit >= 4 && fullMinutes !== 15)) {
            if (s_endTime.split(':')[0] === hour) {
              inputTime = s_startTime;
            } else {
              inputTime = `${inputTime.split(':')[0]}:45`;
            }
          } else if (fullMinutes === 30 || lastDigit === 3) {
            if (s_endTime.split(':')[0] === hour) {
              if (parseInt(s_endTime.split(':')[1]) > 30) {
                inputTime = `${inputTime.split(':')[0]}:30`;
              } else {
                inputTime = s_startTime;
              }
            } else {
              inputTime = `${inputTime.split(':')[0]}:30`;
            }
          } else if (lastDigit === 2 || lastDigit === 1) {
            if (s_endTime.split(':')[0] === hour) {
              if (parseInt(s_endTime.split(':')[1]) > 15) {
                inputTime = `${inputTime.split(':')[0]}:15`;
              } else {
                inputTime = s_startTime;
              }
            } else {
              inputTime = `${inputTime.split(':')[0]}:15`;
            }
          } else if (lastDigit === 0) {
            inputTime = `${inputTime.split(':')[0]}:00`;
          }
          setStartTime(timeToDateTime(inputTime));
        }
      } else if (field.id === "endTime") {
        newEndTime = DateTime.fromMillis(timeToDateTime(inputTime));
        newStartTime = DateTime.fromMillis(parseInt(startTime));
        let s_endTime = DateTime.fromMillis(parseInt(endTime)).toLocaleString(DateTime.TIME_24_SIMPLE);
        let s_startTime = DateTime.fromMillis(parseInt(startTime)).toLocaleString(DateTime.TIME_24_SIMPLE);
        if (s_startTime.split(':')[0].length < 2) {
          s_startTime = `0${s_startTime}`;
        }

        console.log('new end time', inputTime);
        console.log('old end time', DateTime.fromMillis(parseInt(endTime)).toLocaleString(DateTime.TIME_24_SIMPLE));
        if (newEndTime <= newStartTime) {
          if (DateTime.fromMillis(parseInt(endTime)).toLocaleString(DateTime.TIME_24_SIMPLE).split(':')[0] === '11') {
            setEndTime(timeToDateTime(`13:${inputTime.split(':')[1]}`));
          }
        } else {
          let hour = inputTime.split(':')[0];
          let fullMinutes = inputTime.split(':')[1];
          let lastDigit = parseInt(fullMinutes.split('')[1]);
          fullMinutes = parseInt(fullMinutes);

          if (fullMinutes === 45 || (lastDigit >= 4 && fullMinutes !== 15)) {
            inputTime = `${inputTime.split(':')[0]}:45`;
          } else if (fullMinutes === 30 || lastDigit === 3) {
            if (s_startTime.split(':')[0] === hour) {
              if (parseInt(s_startTime.split(':')[1]) < 30) {
                inputTime = `${inputTime.split(':')[0]}:30`;
              } else {
                inputTime = s_endTime;
              }
            } else {
              inputTime = `${inputTime.split(':')[0]}:30`;
            }
          } else if (lastDigit === 2 || lastDigit === 1) {
            if (s_endTime.split(':')[0] === hour) {
              console.log('here in 15', parseInt(s_endTime.split(':')[1]))
              if (parseInt(s_endTime.split(':')[1]) < 15) {
                inputTime = `${inputTime.split(':')[0]}:15`;
              } else {
                inputTime = s_endTime;
              }
            } else {
              inputTime = `${inputTime.split(':')[0]}:15`;
            }
          } else if (lastDigit === 0) {
            if (s_startTime.split(':')[0] === hour) {
              inputTime = s_startTime;
            } else {
              inputTime = `${inputTime.split(':')[0]}:00`;
            }
          }
          setEndTime(timeToDateTime(inputTime));
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
                          required
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
                      className="input is-small"
                      id="startTime"
                      type="time"
                      step={timeRange * 60}
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
                      className="input is-small"
                      id="endTime"
                      type="time"
                      step={timeRange * 60}
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
