import React,{useState,useEffect,useContext, createContext, Children} from "react";           
import axios from "axios";                
import {
    useAddress,
    useContract,
    useMetamask,
    useDisconnect,
    useSigner
} from '@thirdweb-dev/react'
import { ethers, Signer } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({Children}) =>{
    const {contract} = useContract("0x39eb3aAd2a0551cAA773ef2dC03fafBFbdFE6608")

    const address = useAddress();
    const connect = useMetamask();
    const disconnect = useDisconnect()
    const [userBalance, setUserBalance] = useState()
    const [loader, setLoder] = useState(false)

    const fetchData = async()=>{
        try {
            const balance = await Signer.getBalance();
            const userBalance = address ? ethers.utils.formatEther(balance?.toString()):"";
            setUserBalance(userBalance)
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        fetchData();
    },[])

    const UploadImage = async(imageInfo)=>{
        const {title, description, email, category, image} = imageInfo
        try {
            const listingPrice = await contract.call("listingPrice");
            const createdNFTs = await contract.call(
                "uploadIPFS",
                [address,image,title,description,email,category],
                {
                    value:listingPrice.toString(),
                }
            )

            const response = await axios({
                method:"POST",
                url:`/api/v1/NFTs`,
                data:{
                    title,
                    description,
                    category,
                    image,
                    address,
                    email
                }
            })
            console.log(response);
            console.log('contract call success',createdNFTs);
            setLoder(false);
            window.location.reload();
        } catch (error) {
            console.log("contract call failure",error);
        }
    }

    const getUploadedImages = async() =>{
        const images = await contract.call("getAllNFTs");

        const totalUpload = await contract.call("imagesCount");

        const listingPrice = await contract.call("listingPrice");
        const allImages = images.map((images,i)=>({
            owner:images.creator,
            title:images.title,
            description:images.description,
            email:images,email,
            category:images.category,
            fundraised:images.fundraised,
            image:images.image,
            imageID:images.id.toNumber(),
            createdAt:images.timestamp.toNumber(),
            listingAmount: ethers.utils.formatEther(listingPrice.toString()),
            totalUpload:totalUpload.toNumber(),
        }));
        return allImages;
    }

    const singleImages = async(id)=>{
        try {
            const data = await contract.call("getImage",[id]);
            const image = {
                title:data[0],
                description:data[1],
                email:data[2],
                category:data[3],
                fundraised:ethers.utils.formatEther(data[4].toString()),
                creator:data[5],
                imageURL:data[6],
                createdAt:data[7].toNumber(),
                imageId:data[8].toNumber(),
            }

            return image;
        } catch (error) {
            console.log(error);
        }
    }

    const donateFund = async({amount,Id})=>{
        try {
            console.log(amount,Id);
            const transaction = await contract.call("donateToImage",[Id],{
                value:amount.toString(),
            });
            console.log(transaction);
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    }

    const getAllNftsAPI = async()=>{
        const response = await axios({
            method:"GET",
            url:"/api/v1/NFTs",
        })
        console.log(response);
    }

    const getSingleNftsAPI = async(id)=>{
        const response = await axios({
            method:"GET",
            url:`/api/v1/NFTs${id}`,
        })
        console.log(response);
    }


    return (
        <StateContext.Provider
            value={{
                //CONTRACT
                address,
                contract,
                connect,
                disconnect,
                userBalance,
                setLoder,
                loader,
                //Function
                UploadImage,
                getUploadedImages,
                donateFund,
                singleImages,
                //API
                getAllNftsAPI,
                getSingleNftsAPI
            }}>{Children}</StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);