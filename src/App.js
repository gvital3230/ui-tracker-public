import logo from './logo.svg';
import './App.css';
import ReconnectingWebSocket from 'reconnecting-websocket';
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {useEffect} from "react";

function App() {
    useEffect(() => {
        const rws = new ReconnectingWebSocket('ws://localhost:8080/echo');
        let timer = null

        rws.addEventListener('open', () => {
            // Initialize an agent at application startup.
            const fpPromise = FingerprintJS.load();
            (async () => {
                // Get the visitor identifier when you need it.
                const fp = await fpPromise
                const result = await fp.get()

                // This is the visitor identifier:
                const visitorId = result.visitorId
                timer = setInterval(() => {
                    rws.send('hello from ' + visitorId + '!')
                }, 1000);
            })()
        });

        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
