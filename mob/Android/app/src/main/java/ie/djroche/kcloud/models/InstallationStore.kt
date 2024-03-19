package ie.djroche.kcloud.models

import androidx.lifecycle.MutableLiveData

interface InstallationStore {
    fun findByQR(userID: UInt,
                 QRCode: String,
                 site  : MutableLiveData<InstallationModel>)

    fun update(userID: String,
               site: InstallationModel)

    fun findAllForUser(userID:UInt,
                       installationList:
                       MutableLiveData<List<InstallationModel>>)

    fun findById(userID:UInt,
                 siteID: String,
                 site  : MutableLiveData<InstallationModel>)
}