import React, { useState, useEffect, useContext, useRef, createRef } from 'react'
import { DateTime } from 'luxon';
import { CalendarContext } from '../../contexts/CalendarContext';
import { v4 as uuid } from 'uuid';
import { UserContext } from '../../contexts/UserContext';
import bulmaCalendar from '../../../node_modules/bulma-calendar/dist/js/bulma-calendar';

function Modal(props) {
  const { duration, active, modalMode, week } = props;
  const { columnHeight, events, setevents, id, setNewEvent, timeRange } = useContext(CalendarContext);
  const { users, displayUsers, setdisplayUsers, currentUser, setcurrentUser } = useContext(UserContext);
  const startRef = useRef();
  const endRef = useRef();

  const [modalEvent, setmodalEvent] = useState({});
  const [deleteStage, setdeleteStage] = useState('');
  const [modalInfo, setModalInfo] = useState({
    title: '',
    fields: [
      { label: 'Name', name: 'name', type: 'text', valueKey: 'name' },
      { label: 'Description', name: 'desc', type: 'text', valueKey: 'name' }
    ]
  });

  useEffect(() => {
    let dayArray = [];
    for (let day in week) {
      dayArray = [...dayArray, week[day]]
    };
    let day = dayArray.filter((day) => day.includes(id))
    if (day.length > 0) {
      day = day[0];
    }

    if (modalMode === 'create') {
      let startTime = id;
      let endTime = day[day.indexOf(id) + 1]; //+2 ??

      setModalInfo({
        ...modalInfo,
        title: 'Please enter the required information',
      });
      setmodalEvent({
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
        yOffset: day.indexOf(id) * columnHeight,
        xOffset: 0,
        zIndex: 0
      });
    } else if (modalMode === 'edit') {
      setModalInfo({
        ...modalInfo,
        title: 'Please edit the required information',
      });
      console.log(events.findIndex((el) => el.id === id))
      setmodalEvent({
        ...events[events.findIndex((el) => el.id === id)]
      });
    } else if (modalMode === 'delete') {
      setModalInfo({
        ...modalInfo,
        title: 'Are you sure you want to delete this entry?',
      });
    };
  }, []);

  useEffect(() => {
    const timeInputs = bulmaCalendar.attach('[type="time"]', {
      showClearButton: false,
      dataIsRange: false,
      showHeader: false
    });
    timeInputs.forEach((timeInput) => {
      timeInput.on('time:selected', (time) => {
      });
    });
    const element = startRef.current;
    console.log(element)
    if (element) {
      element.bulmaCalendar.on('select', (datepicker) => {
        console.log(datepicker.data.value())
      });
    }

  }, [])

  const handleChange = (e) => {
    let { name, value, type } = e.target;
    console.log(type)
    setmodalEvent({
      ...modalEvent,
      [name]: value
    });
    // console.log(modalEvent);
  };

  const acceptModal = () => {
    let index = events.findIndex(obj => obj.id === id);
    if (modalMode === 'create') {
      setevents([
        ...events,
        modalEvent
      ]);
    } else {
      let updEvents = [...events];
      updEvents[index] = modalEvent;
      setevents([
        ...updEvents
      ]);
    }
    setNewEvent(true);
    active(false);
  };

  const cancelModal = () => {
    active(false);
    setdeleteStage('');
  };

  const deleteEvent = () => {
    if (!deleteStage) {
      setdeleteStage('confirm');
    } else {
      let filteredArray = events.filter((event) => event.id !== id);
      setevents([
        ...filteredArray
      ]);
      setdeleteStage('');
      active(false);
    }
  };

  const handleTime = (e) => {
    console.log(e)
    return "08:00"
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
            <div key={"startTime"} className="field is-horizontal">
              <div className="field-label is-small">
                <label className="label">Start time</label>
              </div>
              <div className="field-body">
                <div className="field">
                  <div className="control is-expanded" key={`control_startTime`}>
                    <input
                      className="input is-small"
                      type="time"
                      name="startTime"
                      min={modalEvent["startTime"]}
                      step={timeRange * 60}
                      ref={startRef}
                      value={"08:00"}
                      onChange={e => handleChange(e)}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={acceptModal}>Yes</button>
            <button className="button" onClick={cancelModal}>No</button>
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
