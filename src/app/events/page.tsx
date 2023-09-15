"use client";
import { useAuth } from "@/contexts/auth";
import { useLoader } from "@/contexts/loading";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Modal from "./../../components/modal";
import axiosApi from "@/utils/api/axiosapi";

const Page = () => {
  //@ts-ignore
  const { setLoading } = useLoader();
  //@ts-ignore
  const { isLogged } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [creationModel, setCreationModel] = useState(false);
  const [deletionModel, setDeletionModel] = useState(false);
  const [modificationModel, setModificationModel] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [events, setEvents] = useState([]);
  const [actualId, setActualId] = useState("");
  const fetcher = async () => {
    const { Logged, isVerified } = await isLogged();
    setIsLoading(false);
    if (Logged) {
      if (isVerified) {
        setLoading(false);
      } else {
        router.push("/verifyemail");
      }
    } else {
      router.push("/login");
    }
  };
  const getAllEvents = async () => {
    await axiosApi.get("/events").then((res) => {
      let allEvents: any = res.data;
      //@ts-ignore
      allEvents.forEach((event) => {
        const correctDate = new Date(event.date);
        const year = correctDate.getFullYear();
        const month = String(correctDate.getMonth() + 1).padStart(2, "0");
        const day = String(correctDate.getDate()).padStart(2, "0");
        const hours = String(correctDate.getHours()).padStart(2, "0");
        const minutes = String(correctDate.getMinutes()).padStart(2, "0");
        event.date = `${year}-${month}-${day} ${hours}:${minutes}`;
      });
      setEvents(allEvents);
    });
  };
  useEffect(() => {
    setActualId("");
    fetcher();
    getAllEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = async () => {
    if (title.length > 0 && date.length > 0) {
      const dateWithGMT = new Date(date);
      const event = { title, date :dateWithGMT};
      await axiosApi.post("/events", event).then((res) => {
        let allEvents = res.data;
        //@ts-ignore
        allEvents.forEach((event) => {
          const correctDate = new Date(event.date);
          const year = correctDate.getFullYear();
          const month = String(correctDate.getMonth() + 1).padStart(2, "0");
          const day = String(correctDate.getDate()).padStart(2, "0");
          const hours = String(correctDate.getHours()).padStart(2, "0");
          const minutes = String(correctDate.getMinutes()).padStart(2, "0");
          event.date = `${year}-${month}-${day} ${hours}:${minutes}`;
        });
        setEvents(allEvents);
        setCreationModel(false);
      });
    } 
  };
  const handleUpdate = async () => {
    if (title.length > 0 && date.length > 0) {
      const dateWithGMT = new Date(date);
      const event = { title, date: dateWithGMT };
      await axiosApi.put(`/events/${actualId}`, event).then((res) => {
        let allEvents = res.data;
        //@ts-ignore
        allEvents.forEach((event) => {
          const correctDate = new Date(event.date);
          const year = correctDate.getFullYear();
          const month = String(correctDate.getMonth() + 1).padStart(2, "0");
          const day = String(correctDate.getDate()).padStart(2, "0");
          const hours = String(correctDate.getHours()).padStart(2, "0");
          const minutes = String(correctDate.getMinutes()).padStart(2, "0");
          event.date = `${year}-${month}-${day} ${hours}:${minutes}`;
        });
        setEvents(allEvents);
        setModificationModel(false);
      });
    }
  };
  //@ts-ignore
  const handleModify = async (eventId) => {
    setActualId(eventId);
    await axiosApi.get(`/events/${eventId}`).then((res) => {
      setDate(res.data[0].date.slice(0, 16));
      setTitle(res.data[0].title);
    });
    setModificationModel(true);
  };
  const handleDeletion = async () => {
    await axiosApi.delete(`/events/${actualId}`).then((res) => {
      let allEvents = res.data;
      //@ts-ignore
      allEvents.forEach((event) => {
        const correctDate = new Date(event.date);
        const year = correctDate.getFullYear();
        const month = String(correctDate.getMonth() + 1).padStart(2, "0");
        const day = String(correctDate.getDate()).padStart(2, "0");
        const hours = String(correctDate.getHours()).padStart(2, "0");
        const minutes = String(correctDate.getMinutes()).padStart(2, "0");
        event.date = `${year}-${month}-${day} ${hours}:${minutes}`;
      });
      setEvents(allEvents);
      setDeletionModel(false);
    });
  };
  if (!isLoading) {
    return (
      <div>
        <h2>
          Add a new task{" "}
          <div
            className="icons"
            onClick={() => {
              setTitle("");
              setDate("");
              setCreationModel(true);
            }}
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              {" "}
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z" />{" "}
              <path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4zM8 8a.5.5 0 0 1 .5.5V10H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V11H6a.5.5 0 0 1 0-1h1.5V8.5A.5.5 0 0 1 8 8z" />{" "}
            </svg>{" "}
          </div>
        </h2>
        <div className="events-list">
          {events.map((event) => {
            return (
              <div key={event._id} className="task">
                <div className="title">{event.title}</div>
                <div className="date">{event.date}</div>
                <div className="icon-box">
                  <div
                    className="icons"
                    onClick={() => handleModify(event._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      {" "}
                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />{" "}
                      <path
                        fillRule="evenodd"
                        d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
                      />{" "}
                    </svg>
                  </div>
                  <div
                    className="icons"
                    onClick={() => {
                      setActualId(event._id);
                      setDeletionModel(true);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <g>
                        <path fill="none" d="M0 0h24v24H0z" />{" "}
                        <path
                          fill="currentColor"
                          d="M4 8h16v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8zm2 2v10h12V10H6zm3 2h2v6H9v-6zm4 0h2v6h-2v-6zM7 5V3a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2h5v2H2V5h5zm2-1v1h6V4H9z"
                        />{" "}
                      </g>{" "}
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {creationModel && (
          <Modal>
            <div className="modal">
              <div className="creation">
                <h2>Create new task</h2>
                <div className="inbox">
                  <input
                    type="text"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <span>Title</span>
                </div>
                <div className="inbox">
                  <input
                    type="datetime-local"
                    required
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                  <span>date</span>
                </div>
                <button onClick={() => setCreationModel(false)}>close</button>
                <button onClick={handleCreate}>create</button>
              </div>
            </div>
          </Modal>
        )}
        {deletionModel && (
          <Modal>
            <div className="modal">
              <div className="deletion">
                <h2>Do you really want to delete this task ?</h2>
                <button onClick={() => setDeletionModel(false)}>NO</button>
                <button onClick={handleDeletion}>YES</button>
              </div>
            </div>
          </Modal>
        )}
        {modificationModel && (
          <Modal>
            <div className="modal">
              <div className="modification">
                {" "}
                <h2>Modify this task</h2>
                <div className="inbox">
                  <input
                    type="text"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                  />
                  <span>Title</span>
                </div>
                <div className="inbox">
                  <input
                    type="datetime-local"
                    required
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                  />
                  <span>date</span>
                </div>
                <button onClick={() => setModificationModel(false)}>
                  close
                </button>
                <button onClick={handleUpdate}>Update</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
  return <div></div>;
};

export default Page;
