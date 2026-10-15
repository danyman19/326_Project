import { Ok, Err } from "../results.js"
import {getAll, save} from "../repositories/eventsRepository.js"


const validateEvent = ({title, date, notes= ""} = {}) => {
    if(typeof title !== "string" || !title.trim()) {
        return Err({
            status: 400, 
            message: "Event title is required"
        });
    }
    if (typeof date !== "string" || !isValidDate(date)) {
        return Err({
            status: 400,
            message: "A valid date is required (YYYY-MM-DD)"
        });
    }
    if (typeof notes !== "string") {
        return Err({
            status: 400,
            message: "Event notes must be text"
        });
    }
    return Ok({title:title.trim(), date, notes:notes.trim()});
};

//validation check for date: make sure if YYYY-MM-DD format and is real date

export const listEvents = async () => {
    return await getAll();
}

export const createEvent = async (data) => {
  const result = validateEvent(data);
  if (!result.ok) return result;

  const events = await getAll();
  events.push(result.value);
  await save(events);

  return Ok(result.value);
};
