import { auth } from '$lib/core/services/firebase';
import { Log } from '$lib/core/services/logging';
import { notificationStore } from '$lib/features/Notifications/store/notifications';
import { NotificationType, Position } from '$lib/models/enums/notifications';
import { USER_COOKIE_ID_NAME } from '$lib/shared/utils/constants';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signOut as firebaseSignOut,
  signInWithPopup
} from 'firebase/auth';
import Cookies from 'js-cookie';

export function signOut() {
  return firebaseSignOut(auth);
}

export function loginGoogle() {
  const provider = new GoogleAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      Log.DEBUG('SignIn Google', { credential, result });
      Cookies.set(USER_COOKIE_ID_NAME, result.user.uid);
      return true;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      Log.ERROR('SignIn Google', { errorCode, errorMessage });
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: errorMessage,
        removeAfter: 5000,
        position: Position.BottomRight
      });
      return false;
    });
}

export function loginGitHub() {
  const provider = new GithubAuthProvider();
  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      const credential = GithubAuthProvider.credentialFromResult(result);
      Log.DEBUG('SignIn Github', { credential, result });
      Cookies.set(USER_COOKIE_ID_NAME, result.user.uid);
      return true;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      Log.ERROR('SignIn Github', { errorCode, errorMessage });
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: errorMessage,
        removeAfter: 5000,
        position: Position.BottomRight
      });
      return false;
    });
}

export function loginTwitter() {
  const provider = new TwitterAuthProvider();

  return signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Twitter Access Token. You can use it to access the Twitter API.
      const credential = TwitterAuthProvider.credentialFromResult(result);
      Log.DEBUG('SignIn Twitter', { credential, result });
      Cookies.set(USER_COOKIE_ID_NAME, result.user.uid);
      return true;
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      Log.ERROR('SignIn Twitter', { errorCode, errorMessage });
      notificationStore.addNotification({
        type: NotificationType.GeneralError,
        message: errorMessage,
        removeAfter: 5000,
        position: Position.BottomRight
      });
      return false;
    });
}
