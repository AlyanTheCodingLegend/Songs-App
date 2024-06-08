import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import toast_style from "./ToastStyle";
import supabase from "./ClientInstance";
import "./NoScrollbar.css"
import { BeatLoader } from "react-spinners";
import SearchBar from "./SearchBar";

type LayoutProps = {
    isOpen: boolean;
    username: string;
    setOpenPlaylist: (value: boolean) => void;
    setPlaylistID: React.Dispatch<React.SetStateAction<number>>;
}

type Playlist = {
    playlist_id: string;
    playlist_name: string;
}

export default function Layout({isOpen, username, setOpenPlaylist, setPlaylistID}: LayoutProps): JSX.Element {
    const [playlists, setPlaylists] = useState<Array<Playlist>>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        async function loadPlaylists() {
            setIsLoading(true)
            const {data, error} = await supabase.from('playlist_information').select('playlist_id, playlist_name').eq('created_by', username)
            if (error) {
                toast.error(error.message, toast_style)
            } else {
                setPlaylists(data)
            }
            setIsLoading(false)
        }

        loadPlaylists()
    }, [username])

    if (isLoading) {
        return (
            <div className={`${isOpen ? "ml-[250px] max-w-custom" : "ml-[50px] max-w-custom2"} bg-gradient-to-b from-black to-slate-700 w-screen min-h-screen overflow-x-hidden flex items-center justify-center`}>
                <BeatLoader size={30} color="purple"/>
            </div>
        )
    }

    return (
        <div className={`${isOpen ? "ml-[250px] max-w-custom" : "ml-[50px] max-w-custom2"} bg-gradient-to-b from-black to-slate-700 w-screen min-h-screen overflow-x-hidden no-scrollbar`}>
            <div className="text-white text-2xl h-full">
                <div className="ml-4 mt-2">Welcome, {username} 👋</div>
                <div className="mt-5 border-gray-300 border-t-2 mb-5"></div>
                <div className="ml-4 text-lg">Search for your favourite songs down below!</div>
                <SearchBar />
                <div className="mt-5 border-gray-300 border-t-2 mb-5"></div>
                <div className="mb-5 ml-4">Your Playlists</div>
                {playlists && playlists.length!==0 ? (
                <div className="flex flex-wrap">
                    {playlists && playlists.map((playlist, index) => (
                    <div key={index} className="relative group ml-4 mb-10">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-700 to-purple-400 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex flex-col justify-center items-center h-40 w-40 bg-black rounded-lg text-gray-200 hover:text-white hover:cursor-pointer" onClick={() => { setPlaylistID(Number(playlist.playlist_id)); setOpenPlaylist(true); }}>
                        <img src="https://uddenmrxulkqkllfwxlp.supabase.co/storage/v1/object/public/images/assets/anonymous-man-graphic-good-pfp-1y0csvb81cmqaggg.jpg" alt="default playlist" className="w-4/5 h-4/5 rounded-lg" />
                        <div className="text-lg">{playlist.playlist_name}</div>
                    </div>
                </div>
                    ))}
                </div>
                   
                ) : (<div className="text-sm ml-4">Please create playlists to listen to them and view them here 😊</div>)}
            </div>
        </div>
    )
}