<?php
/**
 * Route class
 * Class for save and load routes for flight
 * @author oleg
 *
 * The followings are the available columns in table 'route':
 * @property integer $id
 * @property integer $searchId
 * @property integer $departureCityId
 * @property integer $departureAirportId
 * @property string $departureDate
 * @property integer $arrivalCityId
 * @property integer $arrivalAirportId
 * @property integer $adultCount
 * @property integer $childCount
 * @property integer $infantCount
 *
 * The followings are the available model relations:
 * @property FlightSearch $search
 * @property City $departureCity
 * @property City $arrivalCity
 */
class Route extends CModel
{
    /**
     * @return array validation rules for model attributes.
     */
    public function rules()
    {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('searchId, departureCityId, departureAirportId, arrivalCityId, arrivalAirportId, adultCount, childCount, infantCount', 'numerical', 'integerOnly'=>true),
            array('departureDate', 'safe'),
            // The following rule is used by search().
            // Please remove those attributes that should not be searched.
            array('id, searchId, departureCityId, departureAirportId, departureDate, arrivalCityId, arrivalAirportId, adultCount, childCount, infantCount', 'safe', 'on'=>'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations()
    {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'search' => array(self::BELONGS_TO, 'FlightSearch', 'searchId'),
            'departureCity' => array(self::BELONGS_TO, 'City', 'departureCityId'),
            'arrivalCity' => array(self::BELONGS_TO, 'City', 'arrivalCityId'),
        );
    }

    /**
     * Returns the list of attribute names of the model.
     * @return array list of attribute names.
     */
    public function attributeNames()
    {
        return array(
            'id',
            'searchId',
            'departureCityId',
            'departureAirportId',
            'departureDate',
            'arrivalCityId',
            'arrivalAirportId',
            'adultCount',
            'childCount',
            'infantCount',
        );
    }
}