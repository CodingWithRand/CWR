import { useNavigate, useNavigation, useParams } from "react-router-dom";

export default function FoundationOfProgramming() {
    const { stageName, sectionName, page } = useParams();
    const navigator = useNavigate();
    return(
        <>
            <h1>{stageName}</h1>
            <h3>{sectionName}</h3>
            <button onClick={() => navigator(`/stage/the-beginning/foundation-of-programming/${parseInt(page) + 1}`)}>{`Current page ${page}`}</button>
        </>
    )
}