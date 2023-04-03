import { useRouter } from 'next/router';
import { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import eventStore from '@/lib/firestore/collections/event';
import nProgress from 'nprogress';
import Splash from '@/srccontent/Splash';
import { useOrganizationContext } from './OrganizationContext';
import { useAuthContext } from './AuthContext';

const EventContext = createContext({});

export const useEventContext = () => useContext(EventContext)

export default (props) => {
    const { currentOrganization } = useOrganizationContext();
    const { user } = useAuthContext();
    const router = useRouter()
    const [events, setEvents] = useState({})
    const [current, setCurrent] = useState(null)
    const [loading, setLoading] = useState(false)
    const [activeCount, setActiveCount] = useState(0)

    const setEvent = async (data, activeCount) => {
        await setEvents(data);
        setActiveCount(activeCount)
    }

    const event = {
        readEvent: async () => {
            setLoading(true)
            await eventStore.read(user?.id, setEvent, () => setLoading(false))
        },
        saveEvent: (data, id) => {
            return eventStore.save(data, id)
        },
        addEvent: async (event) => {
            event = {
                ...event,
                uid: user?.id,
                deleted: false
            }
            return await eventStore.save(event, null)
        },
        updateEvent: (id, newEvent) => {
            return eventStore.save(newEvent, id)
        },
        deleteEvent: async (id) => {
            eventStore.save({ deleted: true }, id)
            router.push('/event/create')
        },
        setCurrentEvent: async (id) => {
            setCurrent(id)
        },
        uploadFile: eventStore.uploadFile,
        getEvents: (oid) => {
            let temp = {}
            Object.keys(events).forEach((key, i) => {
                if (events[key].oid == oid) {
                    temp[key] = {
                        ...events[key]
                    }
                }
            })
            return temp
        }
    }

    useEffect(() => {
        event.readEvent()
    }, [])

    useEffect(() => {
        if (loading == false && Object.keys(events).length == 0 && currentOrganization)
            router.push('/event/create?organization=' + currentOrganization)
    }, [events, loading, currentOrganization])

    return (
        <EventContext.Provider value={{
            events, ...event,
            current, setCurrent,
            activeCount, loading
        }}>
            {loading ? <Splash content='Loading data...'></Splash> : props.children}
        </EventContext.Provider>
    )
}
