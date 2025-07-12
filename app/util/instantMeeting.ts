import { toast } from "react-toastify";
import { useMeeting } from "../stores/meeting/useMeetingStore"
import router from "next/router";


export function initial() {
    const {
        create,
        createMeetingValue,
        join,
        setMeetingId
    } = useMeeting()

    async function instantMeeting() {
        try {
          if (createMeetingValue) {
            const id = await create(createMeetingValue);
      
            if (!id) {
              toast.error("Failed to create meeting");
              return;
            }
      
            const value = {
              meeting_id: id,
              room_name: createMeetingValue.room_name
            };

            // setMeetingId(value.meeting_id)
      
            console.log("value 0.1:", value);
            await join(value);

            return id
          }
        } catch (error) {
          console.log(error);
        }
      }
      

    return { instantMeeting }
}



