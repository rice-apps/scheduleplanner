<?php

/*enum*/ class ProtocolMessageError {
  const NONE = 0;
  const XSRF_EXPIRED = 1;
  const SESSION_EXPIRED = 2;
}

class ProtocolMessageException extends Exception {}
class ProtocolMessageSerializationException extends ProtocolMessageException {}
class ProtocolMessageDeserializationException extends ProtocolMessageException {}

class ProtocolMessage {
  public /*string*/ $__messageType;
  public /*int*/ $__errorCode = ProtocolMessageError::NONE;

  public function __construct() {
    $this->__messageType = get_class($this);
  }

  public static function serialize(/*ProtocolMessage*/ $protocolMessage) /*throws ProtocolMessageSerializationException*/ {
    if (!is_a($protocolMessage, ProtocolMessage::class)) {
      throw new ProtocolMessageSerializationException('Provided object is not a ProtocolMessage.');
    }

    if(!$protocolMessage->validate()) {
      throw new ProtocolMessageSerializationException('Provided object fails validation.');
    }

    /*$array = array();

    foreach ($protocolMessage as $key => $value) {
      $array[$key] = $value;
    }*/

    $serial = to_json($protocolMessage);

    if ($serial === null) {
      throw new ProtocolMessageSerializationException('Unable to serialize message (unknown encoding error): '.json_last_error_msg());
    }

    return $serial;
  }

  public /*ProtocolMessage*/ static function unserialize(/*string*/ $serializedProtocolMessage, /*string*/ $type = null) {
    $deserialized = from_json($serializedProtocolMessage);

    if ($type !== null) {
      $deserialized['__messageType'] = 'UserRequestProtocolMessage';
    }

    if (!isset($deserialized['__errorCode'])) {
      $deserialized['__errorCode'] = ProtocolMessageError::NONE;
    }

    return static::unserialize_obj($deserialized);
  }

  protected static /*ProtocolMessage*/ function unserialize_obj(/*mixed*/ $deserialized) {
    if (!is_array($deserialized)) {
      throw new ProtocolMessageDeserializationException('Unable to deserialize message (improper encoding)');
    }

    if (!isset($deserialized['__messageType']) || !class_exists($deserialized['__messageType'])) {
      throw new ProtocolMessageDeserializationException('Unknown protocol message type');
    }

    $message = new $deserialized['__messageType']();

    foreach ($message as $key => $_) {
      if (!isset($deserialized[$key])) {
        throw new ProtocolMessageDeserializationException('Unrecognized property ' . $key);
      }

      $value = $deserialized[$key];

      if (is_array($value) && isset($value['__messageType'])) {
        $value = static::unserialize_obj($value);
      }

      $message->{$key} = $value;
    }

    if (!$message->validate()) {
      throw new ProtocolMessageDeserializationException('Deserialized message failed validation');
    }

    return $message;
  }

  public function validate() {
    return true;
  }
}
