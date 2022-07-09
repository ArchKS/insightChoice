// import { resetOption, clearOption } from '../store/features/setOption'
// import { useSelector, useDispatch } from 'react-redux';
// const dispatch = useDispatch();

export function sleep(seconds = 2000){
    return new Promise(function(resolve, reject) {
        setTimeout(() => {
            resolve(true);
        }, seconds);
    });
}


