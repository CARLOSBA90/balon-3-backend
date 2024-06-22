import moment from "moment";



export const today = (zeroTime:boolean): any => {
    const today = new Date();
    
    if(zeroTime)
      today.setHours(-3, 0, 0, 0); 

    return today;
  }


export const parseToDate = (value:string): any => {

  if (!/^\d{8}$/.test(value)) {
    throw new Error('Formato de fecha no válido. Debe ser yyyyMMdd');
  }

  const date = moment(value, 'YYYYMMDD').toDate();
  return date;
}