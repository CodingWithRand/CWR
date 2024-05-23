import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { useRef } from "react";
import { auth, storage } from "@/glient/firebase";
import Client from "@/app/global/client/util";
import { updateProfile } from "@firebase/auth";

const { Section } = Client.Components.Dynamic;

export default function UpdateProfilePicture(){
    const clientPPFLink = useRef();
    async function uploadPPF(e){
        e.preventDefault();
        const storageRef = ref(storage, `userProfileImage/${auth.currentUser.uid}/profile.png`);
        await uploadBytes(storageRef, clientPPFLink.current);
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        window.location.reload();
    }

    return(
        <Section themed style="pallete" title="Profile Picture" description="Change your profile picture here">
            <form className="ppf setting-submitting-form" onSubmit={uploadPPF}>
                <input className="theme text-color" type="file" id="profile-picture-upload-btn" accept="image/png, image/jpeg" onChange={(e) => clientPPFLink.current = new File([e.target.files[0]], "profile.png", { type: "image/png" })}/>
                <input className="submit-btn" type="submit" />
            </form>
        </Section>
    )
}