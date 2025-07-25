import React, { useState } from "react";
import styles from "./Auth.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalContent } from "@heroui/react";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, Firestore } from "firebase/firestore";
import { db, isFirebaseInitialized } from "../../../firebaseConfig";
import Spinner from "../Spinner/Spinner";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Auth = (props: Props) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (!isFirebaseInitialized() || !db) {
        console.warn("Firebase not configured. Authentication disabled.");
        setLoading(false);
        return;
      }

      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        await setDoc(
          userRef,
          {
            userDetails: {
              email: user.email,
              name: user.displayName,
              profilePic: user.photoURL,
            },
          },
          { merge: true }
        );
      } else {
        await setDoc(userRef, {
          userDetails: {
            email: user.email,
            name: user.displayName,
            profilePic: user.photoURL,
            createdAt: serverTimestamp(),
          },
        });
      }

      dispatch(setAuthState(true));
      dispatch(
        setUserDetailsState({
          uid: user.uid,
          name: user.displayName ?? "",
          email: user.email ?? "",
          profilePic: user.photoURL ?? "",
        })
      );
      props.onClose();
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    // Bypass Firebase and set test user directly
    const testUser = {
      uid: "test-user-12345",
      name: "Test User",
      email: "test@omniplex.ai",
      profilePic: "/svgs/User.svg",
    };

    dispatch(setAuthState(true));
    dispatch(setUserDetailsState(testUser));
    props.onClose();
  };

  return (
    <Modal
      size={"lg"}
      radius="md"
      shadow="sm"
      backdrop={"blur"}
      isOpen={props.isOpen}
      onClose={props.onClose}
      placement="bottom-center"
      closeButton={<div></div>}
    >
      <ModalContent>
        {(onClose) => (
          <div className={styles.modal}>
            <div className={styles.titleContainer}>
              <div className={styles.title}></div>
              <div
                className={styles.close}
                onClick={() => {
                  onClose();
                }}
              >
                <Image
                  width={20}
                  height={20}
                  src={"/svgs/CrossWhite.svg"}
                  alt={"X"}
                />
              </div>
            </div>
            <div className={styles.container}>
              <div className={styles.title}>Welcome</div>
              <p className={styles.text}>Let&apos;s Create Your Account</p>

              {loading ? (
                <div className={styles.button}>
                  <div className={styles.spinner}>
                    <Spinner />
                  </div>
                  <div className={styles.buttonText}>Signing in</div>
                </div>
              ) : (
                <>
                  <div className={styles.button} onClick={handleAuth}>
                    <Image
                      src={"/svgs/Google.svg"}
                      alt={"Google"}
                      width={24}
                      height={24}
                    />
                    <div className={styles.buttonText}>Continue with Google</div>
                  </div>
                  
                  <div className={styles.testButton} onClick={handleTestLogin}>
                    <Image
                      src={"/svgs/User.svg"}
                      alt={"Test User"}
                      width={24}
                      height={24}
                    />
                    <div className={styles.buttonText}>Test Login (Demo Mode)</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Auth;
