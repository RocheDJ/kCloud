from contextlib import nullcontext
import sqlite3
import uuid
import settings
import datetime

class dbClass:
    """Class to interface to an SQlite Database"""
     # ----------------------------------------------------------------------------------------
    def __init__(self):
        self.dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
        self.db = sqlite3.connect(self.dbPath)
        self.errorString = "-" 
        self.connectionOpen = False
    # ----------------------------------------------------------------------------------------
    def CloseConn(self):
        if(self.connectionOpen == True):
            self.db.close()
            self.connectionOpen = False
    # ----------------------------------------------------------------------------------------
    def OpenConn(self):
        if(self.connectionOpen == False):
            self.db = sqlite3.connect(self.dbPath)
            self.connectionOpen = True
    # -----------------------------------------------------------------------------------------
    def ClearOldData(self,days):
        try:
           # open db and connect
            self.OpenConn()
      
            c = self.db.cursor()
           # return a query to delete any data over the given days old
           #get current time less the number of days
            utcTimeLessX = datetime.datetime.now() - datetime.timedelta(days =days)
            utcTimeLessX = utcTimeLessX.strftime("%Y-%m-%d %H:%M:%S") # string rep for 
            
            myQuery = ("Delete from  pvo WHERE EventDate < '"+  str(utcTimeLessX) + "';")
            
            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()


            myQuery = ("Delete from  pdo WHERE EventDate < '"+  str(utcTimeLessX) + "';")
            
            c.execute(myQuery)

            # Save (commit) the changes
            self.db.commit()


            # We can also close the connection if we are done with it.
            # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()           

        except Exception as error:
             self.errorString ="ClearOldData Error " + str(error)       
    # -----------------------------------------------------------------------------------------
    def log_PDO_to_DB(self,dataJSON) :
        try:
            # open db and connect
            self.OpenConn()
      
            c = self.db.cursor()
            # generate the insert query
            myUuid = uuid.uuid4()
            installationId =  dataJSON["InstallationID"]
            EventDate =dataJSON["EventDate"]
            Node =  dataJSON["Node"] 
            Type =  dataJSON["Type"] 
            Version =  dataJSON["Version"] 
            Data = dataJSON["Data"]

            myQuery = ("INSERT INTO pdo VALUES ('" 
                       + str(myUuid) 
                       + "',' " 
                       + str(installationId) 
                       + "','" 
                       + str(Node) 
                       + "','" 
                       + str(Type) 
                       + "','" 
                       + str(Version) 
                       + "','" 
                       + str(EventDate) 
                       + "',\"" 
                       + str(Data) 
                       + "\",0)")

            c.execute(myQuery)

        # Save (commit) the changes
            self.db.commit()

        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
             self.errorString ="log_PVO_to_DB Error " + str(error)
    # -----------------------------------------------------------------------------------------
    def log_PVO_to_DB(self,dataJSON) :
        try:
            # open db and connect
            self.OpenConn()
      
            c = self.db.cursor()
            # generate the insert query
            myUuid = uuid.uuid4()
            installationId = str(settings.INSTALLATION_ID)
            utcTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            error = dataJSON["error"]
            data = dataJSON["data"]

            myQuery = ("INSERT INTO pvo VALUES ('" + str(
                myUuid) + "',' " + str(installationId) + "','" + str(utcTime) + "',0,\"" + str(data) + "\",'" + str(
                error) + "')")

            c.execute(myQuery)

        # Save (commit) the changes
            self.db.commit()

        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
             self.errorString ="log_PVO_to_DB Error " + str(error)
    # -----------------------------------------------------------------------------------------
    def logStatus_Of_PVO_to_DB(self,id,postStatus) :
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the  query
            myQuery = ("UPDATE pvo set Status ='" + str(postStatus)+ "' where _id ='" + str(id) + "';")
            c.execute(myQuery)

        # Save (commit) the changes
            self.db.commit()

        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
             self.errorString ="logStatus_Of_PVO_to_DB Error " + str(error)
             #------------------------------------------------------------------------------------------------------------------------
    # -----------------------------------------------------------------------------------------
    def logStatus_Of_PDO_to_DB(self,id,postStatus) :
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the  query
            myQuery = ("UPDATE pdo set Status ='" + str(postStatus)+ "' where _id ='" + str(id) + "';")
            c.execute(myQuery)

        # Save (commit) the changes
            self.db.commit()

        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
             self.errorString ="logStatus_Of_PDO_to_DB Error " + str(error)
    # ----------------------------------------------------------------------------------------------------------------------
    def read_PVO_From_DB(self,PVO_id):
        try:
        # open db and connect
             # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            rows = c.execute("SELECT * FROM pvo WHERE _id = \"" + str(PVO_id) + "\"")
            rows = c.fetchall()
            for row in rows:
              print(row)
            self.CloseConn()
        except Exception as error:
              self.errorString ="read_PVO_From_DB Error " + str(error)
    # ----------------------------------------------------------------------------------------------------------------------
    def read_outStanding_PVO(self):
        try:
            # af status 200 as is ok else need read to
            # open db and connect
            dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
            conn = sqlite3.connect(dbPath)
            c = conn.cursor()
            rows = c.execute("SELECT * FROM pvo WHERE Status <> '200'")
            rows = c.fetchall()
            count = len(rows)
            self.CloseConn()
            return rows
        except Exception as error:
             self.errorString ="read_outStanding_PVO Error " + str(error)
             return nullcontext
    # ----------------------------------------------------------------------------------------------------------------------     
    def read_outStanding_PDO(self):
        try:
            # af status 200 as is ok else need read to
            # open db and connect
            dbPath = str(settings.BASE_DIR) + "/data/" + settings.SQLITE_DB
            conn = sqlite3.connect(dbPath)
            c = conn.cursor()
            rows = c.execute("SELECT * FROM pdo WHERE Status <> '200'")
            rows = c.fetchall()
            count = len(rows)
            self.CloseConn()
            return rows
        except Exception as error:
             self.errorString ="read_outStanding_PDO Error " + str(error)
             return nullcontext
    # ----------------------------------------------------------------------------------------------------------------------  
    def update_PVO_Live(self,dataJSON,pvoIndex):
        try:
            # open db and connect
            self.OpenConn()
            c = self.db.cursor()
            # generate the insert query
            installationId = 'LOCAl'
            utcTime = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            error = dataJSON["error"]
            data = dataJSON["data"]
            
            myQuery = ("UPDATE pvo_live set InstallationID ='" + str(installationId) +
                       "', EventDate ='" +str(utcTime)+
                       "',error ='" + str(error) + 
                       "', Data = \"" +str(data)+ 
                       "\" where id ='" + str(pvoIndex) + "';")
    
            c.execute(myQuery)

        # Save (commit) the changes
            self.db.commit()

        # We can also close the connection if we are done with it.
        # Just be sure any changes have been committed or they will be lost.
            self.CloseConn()
        except Exception as error:
             self.errorString ="log_PVO_to_DB Error " + str(error)


