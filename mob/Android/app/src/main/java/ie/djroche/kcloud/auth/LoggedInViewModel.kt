package ie.djroche.kcloud.auth

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.MutableLiveData
import ie.djroche.kcloud.main.MainApp
import ie.djroche.kcloud.models.UserModel

class LoggedInViewModel(app: Application) : AndroidViewModel(app) {
    var mainApp: MainApp =  app as MainApp


    var liveUser: MutableLiveData<UserModel> = mainApp.user_Manager.liveUser
    var loggedOut: MutableLiveData<Boolean> = mainApp.user_Manager.loggedOut

    fun logOut() {
        mainApp.user_Manager.logOut()
    }
}