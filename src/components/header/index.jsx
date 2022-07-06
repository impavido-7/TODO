import React from "react";

// styles
import styles from "./index.module.scss";

const Header = () => {
    return (
        <>
            <div className={styles.sticky}>
                <div className={styles.header}> TODO </div>
                <div className={styles.spacer}> &nbsp; </div>
            </div>
        </>
    )
}

export default Header;