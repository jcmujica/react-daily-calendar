import React, { useState, useEffect, useContext } from 'react'
import { DateTime } from 'luxon';
import { CalendarContext } from '../Calendar/Calendar';
import { v4 as uuid } from 'uuid';

function Modal(props) {
  const { duration, active, modalMode } = props;
  const { columnHeight, events, setevents, id, week, setNewEvent } = useContext(CalendarContext);
  const [modalEvent, setmodalEvent] = useState({});
  const [modalInfo, setModalInfo] = useState({
    title: '',
    fields: [
      { label: 'Name', name: 'name' },
      { label: 'Description', name: 'desc' },
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
        owner: '',
        participants: [],
        resources: [],
        desc: '',
        height: columnHeight,
        color: 'blue',
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
      setevents({
        ...events[id]
      });
    } else if (modalMode === 'delete') {
      setModalInfo({
        ...modalInfo,
        title: 'Are you sure you want to delete this entry?',
      });
    };
  }, []);

  const handleChange = (e) => {
    let { name, value } = e.target;
    setmodalEvent({
      ...modalEvent,
      [name]: value
    });
    // console.log(modalEvent);
  };

  const acceptModal = () => {
    setevents([
      ...events,
      modalEvent
    ]);
    setNewEvent(true);
    active(false);
    // console.log('events', events)
  };

  const cancelModal = () => {
    active(false);
  };

  return (
    <>
      <div className="modal  is-active">
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">{modalInfo.title}</p>
            <button className="delete" aria-label="close" onClick={cancelModal}></button>
          </header>
          <section className="modal-card-body">
            {modalInfo.fields.length > 0 ? modalInfo.fields.map((field) =>
              (
                <div className="field is-horizontal">
                  <div className="field-label is-small">
                    <label className="label">{field.label}</label>
                  </div>
                  <div className="field-body">
                    <div className="field">
                      <div className="control is-expanded" key={`control_${field.name}`}>
                        <input
                          className="input is-small"
                          type="text"
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
          </section>
          <footer className="modal-card-foot">
            <button className="button is-success" onClick={acceptModal}>Yes</button>
            <button className="button" onClick={cancelModal}>No</button>
          </footer>
        </div>
      </div >
    </>
  )
};

export default Modal;
