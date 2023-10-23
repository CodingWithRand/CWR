import { useNavigate } from "react-router-dom"
import { useGlobal } from "../scripts/global";
import { Components } from "../scripts/util";

export default function IndexHomepage() {
    const navigator = useNavigate();
    const [{}, {isLoggedIn}] = useGlobal();

    return (
        <>
            <Components.AlertBox mode="catch" detect={!isLoggedIn} 
            messages={{
                title: "Your session has expired.",
                subtitle: "Please sign in again!"
            }} 
            action={() => navigator("/registration")}/>
        </>
    )
}