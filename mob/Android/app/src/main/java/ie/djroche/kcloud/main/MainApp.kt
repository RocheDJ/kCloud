package ie.djroche.kcloud.main
//-------------------------------------------------------------------------------------------------
import android.app.Application
import ie.djroche.kcloud.models.PVO_Manager
import ie.djroche.kcloud.models.Site_Manager
import ie.djroche.kcloud.models.User_Manager

import timber.log.Timber
import timber.log.Timber.Forest.i

//-------------------------------------------------------------------------------------------------
class MainApp : Application()  {

//-------------------------------------------------------------------------------------------------
    lateinit var site_Manager : Site_Manager
    lateinit var user_Manager : User_Manager
    lateinit var pvo_Manager : PVO_Manager
    override fun onCreate() {
        super.onCreate()
        Timber.plant(Timber.DebugTree())
        site_Manager = Site_Manager(this)
        user_Manager = User_Manager(this)
        pvo_Manager = PVO_Manager(this)
        i("kCloud application Started")
    }

} // ------------------------------END Of Class ---------------------------------------------------