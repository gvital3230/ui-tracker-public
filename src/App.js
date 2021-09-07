import './App.css';
import ReconnectingWebSocket from 'reconnecting-websocket';
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import {useEffect, useMemo, useState} from "react";
import Item from "./Item";

function App() {
    const [items, setItems] = useState([])
    const [wsConnected, setWsConnected] = useState(null)
    const [visitorId, setVisitorId] = useState(null)
    const wsBackendUrl = process.env.REACT_APP_WS_BACKEND_URL

    const rws = useMemo(() => (new ReconnectingWebSocket(wsBackendUrl + '/ws')), [wsBackendUrl]);

    useEffect(() => {
        async function fetchItems() {
            let res = await fetch("https://picsum.photos/v2/list");
            const resItems = await res.json()
            setItems(resItems);
        }

        fetchItems();

        rws.addEventListener('open', () => {
            setWsConnected(true)
            const fpPromise = FingerprintJS.load();
            (async () => {
                const fp = await fpPromise
                const result = await fp.get()

                setVisitorId(result.visitorId)
            })()
        });

    }, [rws]);

    function trackHandler(item, state) {
        if (wsConnected && visitorId) {
            rws.send(JSON.stringify({
                visitor: visitorId,
                itemId: item.id,
                state: state
            }))
        }
    }

    return (
        <div className="App">
            <header className="App-header">
                {items.map((item) => {
                    return (
                        <Item key={item.id} item={item} trackHandler={trackHandler}/>
                    )
                })}
            </header>
        </div>
    );
}

export default App;
