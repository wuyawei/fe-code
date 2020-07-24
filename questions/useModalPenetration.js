import { useEffect, useMemo } from 'react';
import { ModalHelperFn, scrollingElementPolyfill } from './ModalHelperFn';

// 处理 滚动穿透 hooks
export default function useModalPenetration(flag, className = 'modal-open') {
    const ModalHelper = useMemo(() => ModalHelperFn(className), [className]);
    useEffect(() => {
        // 兼容 scrollingElement
        scrollingElementPolyfill();
    }, []);
    useEffect(() => {
        if (flag) {
            ModalHelper.afterOpen();
        } else {
            ModalHelper.beforeClose();
        }
    }, [flag]);
}
