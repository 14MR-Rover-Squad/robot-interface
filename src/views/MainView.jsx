import React, { useContext, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import ROSLIB from 'roslib'
import { getUser } from '../api/services'
import SideBar from '../components/SideBar'
import AuthContext from '../context/AuthProvider'
import styles from '../styles/MainView.module.css'


const MainView = () => {
    const { setAuth } = useContext(AuthContext)
    const { setRos } = useContext(AuthContext)
    const navigate = useNavigate()


    const checkUser = async (token) => {
        const response = await getUser(token)
        if (response?.status === 200) {
            setAuth(response?.data?.user)
        } else {
            navigate('/connect')
        }
    }

    const checkROS = (rosURL) => {
        // Create a new ros connection
        const tempRos = new ROSLIB.Ros({
            url: rosURL
        })

        tempRos.on('connection', () => {
            setRos(tempRos)
        })

        tempRos.on('error', () => {
            navigate("/connect")
        })
    }

    useEffect(() => {

        // check local store for token and rosURL
        const token = localStorage.getItem('token')
        const rosURL = localStorage.getItem('rosURL')
        if (!token && !rosURL) {
            navigate('/connect')
        }

        checkUser(token)
        checkROS(rosURL)


    }, [])


    return (
        <div className={styles.main__view}>
            <SideBar />
            <div className={styles.main__area}>
                <Outlet />
                <p>Connected</p>
                <button>Disconnect</button>
            </div>
        </div>
    )
}

export default MainView