import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import './Callback.css';

export const Callback = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const userId = searchParams.get("userId");
    const cookie = JSON.stringify({ accessToken, userId});
    document.cookie = `AUTH_SESSION=${cookie}; expires=Tue, 19 Jan 2038 03:14:07 GMT`;

    }, [searchParams]);

    return <h1 className='Callback-Title'>
        Поздравляем, вы успешно авторизованы!
    </h1>
}