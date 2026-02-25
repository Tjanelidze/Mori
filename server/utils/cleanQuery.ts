const cleanQuery = <T extends object>(obj: T): Partial<T> => {
    return (Object.keys(obj) as Array<keyof T>).reduce((acc, key) => {
        const val = obj[key];
        
        if (val != null) {
            acc[key] = val;
        }

        return acc;
    }, {} as Partial<T>);
};


export default cleanQuery;