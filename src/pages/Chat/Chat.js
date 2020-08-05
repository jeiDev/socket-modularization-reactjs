import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";
import ContentEditable from 'react-contenteditable'

import { AccountsObject } from '../../utils/Accounts';
import './Chat.css';

const ENDPOINT = "http://localhost:3000/";
const socket = socketIOClient(ENDPOINT);

let fronAndTo = document.location.pathname.split("/").pop();
fronAndTo = fronAndTo.split("-");

let FROM = AccountsObject[fronAndTo[0]];
let TO = AccountsObject[fronAndTo[1]];

let timeoutWrite;
let saveMessages = [];

function Chat() {
    const [writeMessage, setWriteMessage] = useState(false);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on(`getMessage:${FROM.id}`, data => {
            data = JSON.parse(data);
            data.position = "left";

            saveMessages.push(data);

            setMessages([...saveMessages]);
        });

        socket.on(`getWriteMessage:${FROM.id}`, function (data) {
            setWriteMessage(JSON.parse(data).status || false);
        })
    }, []);


    return (
        <div className="App">
            <div className="screen">

                <div className="blue-alert noselect">
                    <p><i className="fab fa-facebook-messenger"></i></p>
                </div>

                <div className="main">

                    <div className="main-top">
                        <div className="img noselect">
                            <img src={TO.picture || ""} id="pictureTo" />
                        </div>
                        <div className="name">
                            <h2>
                                <span className="letter-anim">{TO.firtname || ""} {TO.lastname || ""}</span>
                            </h2>
                            <p><span className="green-dot fas fa-circle"></span> Active Now</p>
                        </div>

                        <div className="icon call">
                            <i className="fas fa-phone-alt blink"></i>
                        </div>
                        <div className="icon info">
                            <i className="fas fa-info-circle blink"></i>
                        </div>
                    </div>

                    <div className="chatbox">
                        <div>
                            {messages.length > 0 ? (<DrawMSG messages={messages} />) : ""}
                        </div>

                        {writeMessage ? (
                            <div>
                                <div className="chat-bubble-left">
                                    <div className="typing">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                </div>
                            </div>
                        ) : ""}

                    </div>

                    <div className="emoji-block">
                        <p className="emoji">&#128512;</p>
                        <p className="emoji">&#128514;</p>
                        <p className="emoji">&#128515;</p>
                        <p className="emoji">&#128516;</p>
                        <p className="emoji">&#128517;</p>
                        <p className="emoji">&#128518;</p>
                        <p className="emoji">&#128519;</p>
                        <p className="emoji">&#128520;</p>
                        <p className="emoji">&#128521;</p>
                        <p className="emoji">&#128522;</p>
                        <p className="emoji">&#128523;</p>
                        <p className="emoji">&#128524;</p>
                        <p className="emoji">&#128525;</p>
                        <p className="emoji">&#128526;</p>
                        <p className="emoji">&#128527;</p>
                        <p className="emoji">&#128528;</p>
                        <p className="emoji">&#128529;</p>
                        <p className="emoji">&#128530;</p>
                        <p className="emoji">&#128531;</p>
                        <p className="emoji">&#128532;</p>
                        <p className="emoji">&#128533;</p>
                        <p className="emoji">&#128534;</p>
                        <p className="emoji">&#128535;</p>
                        <p className="emoji">&#128536;</p>
                        <p className="emoji">&#128537;</p>
                        <p className="emoji">&#128538;</p>
                        <p className="emoji">&#128539;</p>
                        <p className="emoji">&#128540;</p>
                        <p className="emoji">&#128548;</p>
                        <p className="emoji">&#128541;</p>
                        <p className="emoji">&#128542;</p>
                        <p className="emoji">&#128543;</p>
                        <p className="emoji">&#128544;</p>
                        <p className="emoji">&#128545;</p>
                        <p className="emoji">&#128546;</p>
                        <p className="emoji">&#128547;</p>

                    </div>
                    <form action="#" className="message-section" id="formSendMessage">
                        <div className="form-button">
                            <i className="fas fa-clipboard-list blink"></i>
                        </div>
                        <button id="msg-btn" className="msg" type="button">
                            <textarea className="box-message" aria-placeholder="Type a message..." placeholder="Type a message..." onKeyUp={(e) => (sendWriteORMessage(e, setMessages))}></textarea>
                        </button>
                        <div className="emoji-btn">
                            <span className="fas fa-smile blink"></span>
                        </div>
                        <div className="thumb">
                            <i className="fas fa-thumbs-up"></i>
                        </div>

                    </form>
                </div>

            </div>
        </div>

    );
}

function DrawMSG({ messages }) {
    return (
        messages.map((message, i) => {
            return (
                <div className={`${message.position || "left"}-msg`} key={i}>
                    {message.message}
                    {message.position === "left" ?
                        <div className={`img-${message.position}`}>
                            <img className="theimg" src={`${TO.picture}`} alt="" />
                        </div>
                        : ""}
                </div>
            )
        })
    )
}

function sendWriteORMessage(e, setMessages) {
    let code = e.keyCode;
    let inputMessage = e.target;
    clearTimeout(timeoutWrite);

    //send message
    if (code === 13) {
        let message = inputMessage.value.trim();
        if (message.length < 1) return inputMessage.value = "";
        let send = { userId: TO.id, message }
        
        inputMessage.value = "";
        inputMessage.focus();

        send.position = "right";
        saveMessages.push(send);

        setMessages([...saveMessages]);

        emitWriteMessage(false)
        // delete send.position;

        
        socket.emit(`sendMessage`, JSON.stringify(send));
    }

    emitWriteMessage(inputMessage.value.length > 0);

    timeoutWrite = setTimeout(() => {
        emitWriteMessage(false)
    }, 10000);
}

function emitWriteMessage(status) {
    socket.emit(`sendWriteMessage`, JSON.stringify({ userId: TO.id, status }));
}

export default Chat;
