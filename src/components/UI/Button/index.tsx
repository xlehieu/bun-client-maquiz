import classNames from 'classnames/bind';
import styles from './Button.module.scss';
import { Link } from 'react-router-dom';

const cx = classNames.bind(styles);
// ...passProps phải được đặt ở cuối nó là lấy những cái gì được truyền ngoài những cái trước nó
function Button({
    children,
    primary = false,
    secondary = false,
    outline = false,
    small = false,
    large = false,
    text = false,
    rounded = false,
    disabled = false,
    fontNormal = true,
    fontBold = false,
    to,
    href,
    className,
    leftIcon,
    rightIcon,
    onClick,
    ...passProps
}: any) {
    let Comp = 'button';
    const props = {
        onClick,
        ...passProps,
    };
    //remove event listener when button is disabled
    if (disabled) {
        //delete props.onClick; //loại bỏ thuộc tính trong object
        Object.keys(props).forEach((key) => {
            if (key.startsWith('on') && typeof props[key] === 'function') {
                delete props[key];
            }
        });
    }

    if (to) {
        props.to = to;
        Comp = 'Link';
    } else if (href) {
        props.href = href;
        Comp = 'a';
    }
    const classes = cx('wrapper', {
        secondary, // đây là khi có className ở phía sau thì sẽ truyền vào cx để nó tìm xem trong scss có className đó không nếu không thì thôi
        primary,
        outline,
        small,
        large,
        text,
        rounded,
        disabled,
        [className]: className,
    });
    const classesText = cx('title-btn', `${fontBold ? 'font-bold' : 'font-normal'}`);
    // truyền {...props} nó sẽ như này ví dụ có href="https://www.facebook.com/lexuan.hieu.92167"
    // thì Comp là a và href như trên, onClick là đc truyền vào và tất nhiên nó sẽ thực hiện onlick trước và link href sau
    // {...props} sẽ truyền tất cả thuộc tính của nó vào Comp như này <a href='' onClick={}><a/>
    return (
        <Comp className={`rounded-lg px-2 py-1 text-white hover:scale-95 transition-all ${className}`} {...props}>
            {leftIcon && <span className={cx('icon')}>{leftIcon}</span>}
            <span className={classesText}>{children}</span>
            {rightIcon && <span className={cx('icon')}>{rightIcon}</span>}
        </Comp>
    );
}

export default Button;
