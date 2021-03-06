<?php
/**
 * User: Kuklin Mikhail (kuklin@voyanga.com)
 * Company: Easytrip LLC
 * Date: 10.05.12
 * Time: 11:29
 */
class UserActiveRecord extends CActiveRecord
{
    public static $db;

    function getDbConnection()
    {
        if(self::$db!==null)
            return self::$db;
        else
        {
            self::$db=Yii::app()->userDb;
            if(self::$db instanceof CDbConnection)
                return self::$db;
            else
                throw new CDbException(Yii::t('yii','Frontend Active Record requires a "userDb" CDbConnection application component.'));
        }
    }
}
