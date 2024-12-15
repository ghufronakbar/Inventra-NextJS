const isValidDate = (date: string): boolean => {
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };
  
  export default isValidDate;