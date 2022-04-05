import React, {useEffect, useState} from "react"
import "./time-of-day-choices.styles.scss"
import axios from "axios";
import {TIME_START_MORNING, TIME_START_AFTERNOON, TIME_START_EVENING, TIME_START_NIGHT} from "./time-of-day-choices.data";
import TimeStartContainer from "../time-start-container/time-start-container";



const TimeOfDayChoices = ({

                              setSelectedFormattedStartTime,
                              setSelectedStartTime,
                              selectedFormattedStartTime,
                              selectedStartTime,
                              selectedStartTimeMaxPossibleHours,
                              setSelectedStartTimeMaxPossibleHours,
                              timeOfDayChoice,
                              setTimeOfDayChoice,
                              value,
}) => {

    //used for checking date availability functions
    const [ eveningHoursArrays, setEveningHoursArrays ] = useState(undefined);
    const [ morningHoursArrays, setMorningHoursArrays ] = useState(undefined);
    const [ afternoonHoursArrays, setAfternoonHoursArrays ] = useState(undefined);
    const [ nightHoursArrays, setNightHoursArrays ] = useState(undefined)


    //used as props for startTimeContainer
    const [ availableTimesMorning, setAvailableTimesMorning ] = useState([]);
    const [ availableTimesAfternoon, setAvailableTimesAfternoon ] = useState([])
    const [ availableTimesEvening, setAvailableTimesEvening ] = useState([])
    const [ availableTimesNight, setAvailableTimesNight ] = useState([])
    const customTimeOfDayChoicesStyle = {
        backgroundColor: "#490411",
        color: "white",
        border: "solid thin #470814",
        borderRadius: "3px"
    }

    useEffect(() => {
        setTimeOfDayChoice("");
    },[value])


    function handleChoiceClick(choice){
        setTimeOfDayChoice(choice)
         loadAvailableTimes()
        setSelectedFormattedStartTime()
        setSelectedStartTime()

    }

    function filterUnavailableTimes(unavailableStartTimes, data, name){

        let oneHourAvailableTimes = [];
        let twoHourAvailableTimes = [];
        let threeHourAvailableTimes = [];
        let fourHourAvailableTimes = [];
        let fiveHourAvailableTimes = [];
        let sixHourAvailableTimes = [];

        //for each start time in the current time of day
        // check if the unavalableStartTimes includes the end time of the start time from 1-6 hours

        /// first creat the 1-6 hours endtimes from the startTime
        data.map(startTime => {

            let oneHourAdded = parseInt(startTime.timeStart.substring(0, 2)) + 1;
            if (oneHourAdded < 10) {
                oneHourAdded = "0" + oneHourAdded;
            }
            const oneHourAfterStartTime = oneHourAdded + startTime.timeStart.substring(2, 16);


            let twoHoursAdded = parseInt(startTime.timeStart.substring(0, 2)) + 2;
            if (twoHoursAdded < 10) {
                twoHoursAdded = "0" + twoHoursAdded;
            }
            const twoHoursAfterStartTime = twoHoursAdded + startTime.timeStart.substring(2, 16);

            let threeHoursAdded = parseInt(startTime.timeStart.substring(0, 2)) + 3;
            if (threeHoursAdded < 10) {
                threeHoursAdded = "0" + threeHoursAdded;
            }
            const threeHoursAfterStartTime = threeHoursAdded + startTime.timeStart.substring(2, 16);

            let fourHoursAdded = parseInt(startTime.timeStart.substring(0, 2)) + 4;
            if (fourHoursAdded < 10) {
                fourHoursAdded = "0" + fourHoursAdded;
            }
            const fourHoursAfterStartTime = fourHoursAdded + startTime.timeStart.substring(2, 16);

            let fiveHoursAdded = parseInt(startTime.timeStart.substring(0, 2)) + 5;
            if (fiveHoursAdded < 10) {
                fiveHoursAdded = "0" + fiveHoursAdded;
            }
            const fiveHoursAfterStartTime = fiveHoursAdded + startTime.timeStart.substring(2, 16);

            let sixHoursAdded = parseInt(startTime.timeStart.substring(0, 2)) + 6;
            if (sixHoursAdded < 10) {
                sixHoursAdded = "0" + sixHoursAdded;
            }
            const sixHoursAfterStartTime = sixHoursAdded + startTime.timeStart.substring(2, 16);


            //check if the unavailable start times does not include the initial start time
            // and then the 1-6 hours after that
            if (!unavailableStartTimes.includes(startTime.timeStart)) {
                oneHourAvailableTimes = [...oneHourAvailableTimes, startTime]

                //after adding the available startimes this check if the 1 hour after is unavailable
                //then take it off otherwise check 2-hours after start time then 3,4,5,6
                if (unavailableStartTimes.includes(oneHourAfterStartTime)) {
                    oneHourAvailableTimes.pop();
                }

                if (!unavailableStartTimes.includes(twoHoursAfterStartTime)
                    && !unavailableStartTimes.includes(oneHourAfterStartTime)) {
                    // console.log(startTime.timeStart, "<-- 2 hours")
                    twoHourAvailableTimes = [...twoHourAvailableTimes, startTime];

                }

                if (!unavailableStartTimes.includes(threeHoursAfterStartTime)
                    && !unavailableStartTimes.includes(oneHourAfterStartTime)
                    && !unavailableStartTimes.includes(twoHoursAfterStartTime)) {
                    // console.log(startTime.timeStart, "<-- 2 hours")
                    threeHourAvailableTimes = [...threeHourAvailableTimes, startTime];

                }

                if (!unavailableStartTimes.includes(fourHoursAfterStartTime)
                    && !unavailableStartTimes.includes(threeHoursAfterStartTime)
                    && !unavailableStartTimes.includes(twoHoursAfterStartTime)
                    && !unavailableStartTimes.includes(oneHourAfterStartTime)) {

                    fourHourAvailableTimes = [...fourHourAvailableTimes, startTime]

                }

                if (!unavailableStartTimes.includes(fiveHoursAfterStartTime)
                    && !unavailableStartTimes.includes(fourHoursAfterStartTime)
                    && !unavailableStartTimes.includes(threeHoursAfterStartTime)
                    && !unavailableStartTimes.includes(twoHoursAfterStartTime)
                    && !unavailableStartTimes.includes(oneHourAfterStartTime)) {

                    fiveHourAvailableTimes = [...fiveHourAvailableTimes, startTime]

                }

                if (!unavailableStartTimes.includes(sixHoursAfterStartTime)
                    && !unavailableStartTimes.includes(fiveHoursAfterStartTime)
                    && !unavailableStartTimes.includes(fourHoursAfterStartTime)
                    && !unavailableStartTimes.includes(threeHoursAfterStartTime)
                    && !unavailableStartTimes.includes(twoHoursAfterStartTime)
                    && !unavailableStartTimes.includes(oneHourAfterStartTime)) {

                    sixHourAvailableTimes = [...sixHourAvailableTimes, startTime]
                }


            }

        })


        let allAvailableTimes = [oneHourAvailableTimes, twoHourAvailableTimes, threeHourAvailableTimes, fourHourAvailableTimes, fiveHourAvailableTimes, sixHourAvailableTimes];

        console.log(allAvailableTimes, "**************")




        //here we are going to set all the times of days with the oneHourAvailable times
        //so we can give it as a prop to the startimes contaiers in a later function

        if ( oneHourAvailableTimes.length > 0 ){
            switch (name) {
                case "morning":
                    setAvailableTimesMorning(oneHourAvailableTimes);
                    break;
                case "afternoon":
                    setAvailableTimesAfternoon(oneHourAvailableTimes);
                    break;
                case "evening":
                    setAvailableTimesEvening(oneHourAvailableTimes);
                    break;
                case "night":
                    setAvailableTimesNight(oneHourAvailableTimes);
                    break;
            }
        }

        return allAvailableTimes;



    }
    function calculateAvailableTimes(unavailableStartTimes){

        //populate available times for each time of dat
        let morningTimesHours = filterUnavailableTimes(unavailableStartTimes, TIME_START_MORNING, "morning");
        let afternoonTimesHours = filterUnavailableTimes(unavailableStartTimes, TIME_START_AFTERNOON, "afternoon");
        let eveningTimesHours = filterUnavailableTimes(unavailableStartTimes, TIME_START_EVENING, "evening");
        let nightTimesHours = filterUnavailableTimes(unavailableStartTimes, TIME_START_NIGHT, "night");

        setMorningHoursArrays(morningTimesHours);
        setAfternoonHoursArrays(afternoonTimesHours);
        setEveningHoursArrays(eveningTimesHours);
        setNightHoursArrays(nightTimesHours)
    }


    function loadAvailableTimes(){

        const dateStart = new Date(value);
        const dateEnd = new Date(value);
        dateEnd.setHours(24)
        dateEnd.setHours(0,0,0,0)

        //call server
        axios({
            url: 'check-availability',
            method: 'get',
            params: {
                dateStart: dateStart,
                dateEnd: dateEnd
            }
        }).then(response => {
            console.log("Check-Availability succeeded")
            let unavailableStartTimes2 = response.data

            //push late night times
            unavailableStartTimes2.push("26:00:00-07:00");
            unavailableStartTimes2.push("26:15:00-07:00");
            unavailableStartTimes2.push("26:30:00-07:00");
            unavailableStartTimes2.push("26:45:00-07:00");
            unavailableStartTimes2.push("27:00:00-07:00");

            calculateAvailableTimes(unavailableStartTimes2)

        }).catch(error => {
            console.log("check-availability error: ", error)
        });
    }

    function renderCorrectStartTimes(){
        switch (timeOfDayChoice){
            case "Morning":
                if( availableTimesMorning !== undefined) {
                    return (
                        <div className="time-start-containers-div">
                            {availableTimesMorning.map(x => (
                                <TimeStartContainer
                                    setSelectedFormattedStartTime={setSelectedFormattedStartTime}
                                    setSelectedStartTime={setSelectedStartTime}
                                    selectedStartTime={selectedStartTime}
                                    selectedFormattedStartTime={selectedFormattedStartTime}
                                    formattedStartTime={x.timeStartFormated}
                                    startTime={x.timeStart}
                                    numberOfHoursArrays={morningHoursArrays}
                                    setSelectedStartTimeMaxPossibleHours={setSelectedStartTimeMaxPossibleHours}

                                />
                            ))}
                        </div>
                    )
                }else {
                    return <div>Loading Available Morning Times</div>
                }

            case "Afternoon":
                if(availableTimesAfternoon !==  undefined) {
                    return (
                        <div className="time-start-containers-div">
                            {availableTimesAfternoon.map(x => (
                                <TimeStartContainer
                                    setSelectedFormattedStartTime={setSelectedFormattedStartTime}
                                    setSelectedStartTime={setSelectedStartTime}
                                    selectedStartTime={selectedStartTime}
                                    selectedFormattedStartTime={selectedFormattedStartTime}
                                    startTime={x.timeStart}
                                    formattedStartTime={x.timeStartFormated}
                                    numberOfHoursArrays={afternoonHoursArrays}
                                    setSelectedStartTimeMaxPossibleHours={setSelectedStartTimeMaxPossibleHours}
                                />
                            ))}
                        </div>
                    )
                }else {
                    return <div>Loading Available Afternoon Times</div>
                }

            case "Evening":
                if(availableTimesEvening !== undefined) {
                    return  (
                        <div className="time-start-containers-div">
                            {availableTimesEvening.map(x => (
                                <TimeStartContainer
                                    setSelectedFormattedStartTime={setSelectedFormattedStartTime}
                                    setSelectedStartTime={setSelectedStartTime}
                                    selectedStartTime={selectedStartTime}
                                    selectedFormattedStartTime={selectedFormattedStartTime}
                                    startTime={x.timeStart}
                                    formattedStartTime={x.timeStartFormated}
                                    numberOfHoursArrays={eveningHoursArrays}
                                    setSelectedStartTimeMaxPossibleHours={setSelectedStartTimeMaxPossibleHours}
                                />
                            ))}
                        </div>
                    )
                }else {
                    return <div>Loading Available Evening Times</div>
                }
            case "Night":
                if( availableTimesNight !== undefined) {
                    return (
                        <div className="time-start-containers-div">
                            {availableTimesNight.map(x => (
                                <TimeStartContainer
                                    setSelectedFormattedStartTime={setSelectedFormattedStartTime}
                                    setSelectedStartTime={setSelectedStartTime}
                                    selectedStartTime={selectedStartTime}
                                    selectedFormattedStartTime={selectedFormattedStartTime}
                                    startTime={x.timeStart}
                                    formattedStartTime={x.timeStartFormated}
                                    numberOfHoursArrays={nightHoursArrays}
                                    setSelectedStartTimeMaxPossibleHours={setSelectedStartTimeMaxPossibleHours}
                                />
                            ))}
                        </div>
                    )
                }else {
                    return <div>Loading Available Night Times</div>
                }
        }
    }

    function renderTimeOfDayChoices(){
        if( timeOfDayChoice !== "" ){

            switch (timeOfDayChoice) {
                case "Morning":
                    return (
                        <div  className="time-of-day-choices-container-div">
                            <div style={customTimeOfDayChoicesStyle} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Morning
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    6:00 am - 11:45 am
                                </div>
                            </div>
                            <div onClick={() => handleChoiceClick("Afternoon")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Afternoon
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    12:00 pm - 4:45 pm
                                </div>
                            </div>
                            <div onClick={() => handleChoiceClick("Evening")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Evening</div>
                                <div className="time-of-day-choice-time-interval-title">5:00 pm - 9:00 pm</div>
                            </div>
                            <div onClick={() => handleChoiceClick("Night")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Night</div>
                                <div className="time-of-day-choice-time-interval-title">9:15 pm - 12:30 am</div>

                            </div>



                        </div>
                    )
                case "Afternoon":
                    return (
                        <div className="time-of-day-choices-container-div">
                            <div onClick={() => handleChoiceClick("Morning")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Morning
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    6:00 am - 11:45 am
                                </div>
                            </div>
                            <div style={customTimeOfDayChoicesStyle} onClick={() => handleChoiceClick("Afternoon")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Afternoon
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    12:00 pm - 4:45 pm
                                </div>
                            </div>
                            <div onClick={() => handleChoiceClick("Evening")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Evening</div>
                                <div className="time-of-day-choice-time-interval-title">5:00 pm - 9:00 pm</div>
                            </div>
                            <div onClick={() => handleChoiceClick("Night")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Night</div>
                                <div className="time-of-day-choice-time-interval-title">9:15 pm - 12:30 am</div>

                            </div>



                        </div>
                    )
                case "Evening":
                    return (
                        <div className="time-of-day-choices-container-div">
                            <div onClick={() => handleChoiceClick("Morning")}  className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Morning
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    6:00 am - 11:45 am
                                </div>
                            </div>
                            <div onClick={() => handleChoiceClick("Afternoon")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Afternoon
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    12:00 pm - 4:45 pm
                                </div>
                            </div>
                            <div style={customTimeOfDayChoicesStyle} onClick={() => handleChoiceClick("Evening")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Evening</div>
                                <div className="time-of-day-choice-time-interval-title">5:00 pm - 9:00 pm</div>
                            </div>
                            <div onClick={() => handleChoiceClick("Night")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Night</div>
                                <div className="time-of-day-choice-time-interval-title">9:15 pm - 12:30 am</div>

                            </div>



                        </div>
                    )
                case "Night":
                    return (
                        <div className="time-of-day-choices-container-div">
                            <div onClick={() => handleChoiceClick("Morning")}className="time-of-day-choice-container">
                                <div  className="time-of-day-choice-time-title">
                                    Morning
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    6:00 am - 11:45 am
                                </div>
                            </div>
                            <div onClick={() => handleChoiceClick("Afternoon")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">
                                    Afternoon
                                </div>
                                <div className="time-of-day-choice-time-interval-title">
                                    12:00 pm - 4:45 pm
                                </div>
                            </div>
                            <div onClick={() => handleChoiceClick("Evening")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Evening</div>
                                <div className="time-of-day-choice-time-interval-title">5:00 pm - 9:00 pm</div>
                            </div>
                            <div style={customTimeOfDayChoicesStyle} onClick={() => handleChoiceClick("Night")} className="time-of-day-choice-container">
                                <div className="time-of-day-choice-time-title">Night</div>
                                <div  className="time-of-day-choice-time-interval-title">9:15 pm - 12:30 am</div>

                            </div>



                        </div>
                    )
            }
        }else {
            return (
                <div className="time-of-day-choices-container-div">
                    <div onClick={() => handleChoiceClick("Morning")} className="time-of-day-choice-container">
                        <div  className="time-of-day-choice-time-title">
                            Morning
                        </div>
                        <div className="time-of-day-choice-time-interval-title">
                            6:00 am - 11:45 am
                        </div>
                    </div>
                    <div onClick={() => handleChoiceClick("Afternoon")} className="time-of-day-choice-container">
                        <div className="time-of-day-choice-time-title">
                            Afternoon
                        </div>
                        <div className="time-of-day-choice-time-interval-title">
                            12:00 pm - 4:45 pm
                        </div>
                    </div>
                    <div onClick={() => handleChoiceClick("Evening")} className="time-of-day-choice-container">
                        <div className="time-of-day-choice-time-title">Evening</div>
                        <div className="time-of-day-choice-time-interval-title">5:00 pm - 9:00 pm</div>
                    </div>
                    <div  onClick={() => handleChoiceClick("Night")} className="time-of-day-choice-container">
                        <div className="time-of-day-choice-time-title">Night</div>
                        <div className="time-of-day-choice-time-interval-title">9:15 pm - 12:30 am</div>

                    </div>



                </div>
            )
        }
    }
    return (
        <div>

            {renderTimeOfDayChoices()}
            {renderCorrectStartTimes()}


        </div>
    )
}

export default TimeOfDayChoices;