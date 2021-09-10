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
    const dashboardUrl = process.env.REACT_APP_DASHBOARD_URL

    const rws = useMemo(() => (new ReconnectingWebSocket(wsBackendUrl + '/ws-public')), [wsBackendUrl]);

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
                item_id: item.id,
                state: state
            }))
        }
    }

    return (
        <div className="App">
            <div className="App-container">
                <div className="App-intro">
                    <div>This is demo public app page. Open <a href={dashboardUrl} target="_blank" rel="noreferrer">dashboard</a> and then try to scroll images on this page. Dashboard will track your
                        current active items. Also you can open current page in many browsers and see how it is looks like
                    </div>

                </div>
                {items.map((item) => {
                    return (
                        <Item key={item.id} item={item} trackHandler={trackHandler}/>
                    )
                })}
            </div>
        </div>
    );
}

export default App;
