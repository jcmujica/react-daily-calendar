import React, { useState, useEffect, useContext } from 'react'
import { DateTime } from 'luxon';
import { CalendarContext } from '../Calendar/Calendar';

function Modal(props) {
  const { duration, active, modalMode } = props;
  const { columnHeight, eventList, seteventList, id } = useContext(CalendarContext);
  const [event, setevent] = useState({});
  const [modalInfo, setModalInfo] = useState({
    title: '',
    fields: [
      { label: 'Title', name: 'title' }, { label: 'Assignee', name: 'assignee' }, { label: 'Assigned', name: 'assigned' }
    ]
  });

  useEffect(() => {
    if (modalMode === 'create') {
      setModalInfo({
        ...modalInfo,
        title: 'Please enter the required information',
      });
      setevent({
        title: '',
        assignee: '',
        assigned: '',
        height: columnHeight,
        startTime: DateTime.fromMillis(parseInt(id)).toJSDate(),
        endTime: DateTime.fromMillis(parseInt(id)).plus(duration).toJSDate()
      });
    } else if (modalMode === 'edit') {
      setModalInfo({
        ...modalInfo,
        title: 'Please edit the required information',
      });
      setevent({
        ...eventList[id]
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
    setevent({
      ...event,
      [name]: value
    });
  };

  const acceptModal = () => {
    seteventList({
      ...eventList,
      [id]: {
        ...event
      }
    });
    active(false);
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
                <div className="field" key={`field_${field.name}`}>
                  <div className="control" key={`control_${field.name}`}>
                    <input
                      className="input is-small"
                      type="text"
                      placeholder={field.label}
                      name={field.name}
                      value={event[field.name] || ''}
                      onChange={e => handleChange(e)}
                    ></input>
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
