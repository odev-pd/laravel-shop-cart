<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class RelatedProduct extends Model
{
    protected $fillable = array('points');
    public function products()
    {
        return $this->belongsTo('App\Product', 'related_product_id','id');
    }
}
