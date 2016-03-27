package org.riceapps.scheduleplanner.dom;

import java.util.Iterator;
import java.util.Map;

import lightning.mvc.Param;
import lightning.util.Iterables;
import lightning.util.Iterables.Filter;

import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import com.google.common.collect.ImmutableList;

/**
 * Provides convenience methods for interacting with Java's DOM API which
 * is shockingly horrible.
 */
public class DOM {
  /**
   * Provides a convenience wrapper over the DOM Node API.
   * Allows you chain statements (even on children/attributes that do not exist).
   * 
   * As an example:
   * SmartNode node = new SmartNode(domNode);
   * node.children("TAG").attr("ABC").exists()
   */
  public static class SmartNode {
    private final Node node;
    
    public SmartNode(Node node) {
      this.node = node;
    }
    
    public Node node() {
      return node;
    }
    
    public Iterable<SmartNode> children() {
      if (node == null) {
        return ImmutableList.of();
      }
      
      return Iterables.map(DOM.iter(node.getChildNodes()), x -> new SmartNode(x));
    }
    
    public Iterable<SmartNode> children(Filter<SmartNode> filter) {
      if (node == null) {
        return ImmutableList.of();
      }
      
      return Iterables.filter(Iterables.map(DOM.iter(node.getChildNodes()), x -> new SmartNode(x)), filter);
    }
    
    public Iterable<SmartNode> childElements() {
      return children(e -> e.node.getNodeType() == Node.ELEMENT_NODE);
    }
    
    public Iterable<SmartNode> children(String tagName) {
      return children(e -> e.node.getNodeType() == Node.ELEMENT_NODE && e.node.getNodeName().equals(tagName));
    }
    
    public boolean exists() {
      return node != null;
    }
    
    public Param text() {
      if (node == null) {
        return Param.wrap("$", null);  
      }
      
      return Param.wrap("$", node.getTextContent());
    }
    
    public Iterable<Map.Entry<String, SmartNode>> attributes() {
      if (node == null ||
          node.getNodeType() != Node.ELEMENT_NODE) {
        return ImmutableList.of();
      }
      
      Iterable<Map.Entry<String, Node>> attributes = DOM.iter(node.getAttributes());
      return Iterables.map(attributes, i -> new MapEntry<>(i.getKey(), new SmartNode(i.getValue())));
    }
    
    public Param attribute(String name) {
      if (node == null ||
          node.getAttributes() == null ||
          node.getAttributes().getNamedItem(name) == null) {
        return Param.wrap(name, null);
      }
      
      return Param.wrap(name, node.getAttributes().getNamedItem(name).getNodeValue());
    }
    
    public Param attr(String name) {
      return attribute(name);
    }
    
    public SmartNode child(String name) {
      if (!(node instanceof Element)) {
        return new SmartNode(null);
      }
      
      if (((Element) node).getElementsByTagName(name).getLength() == 0) {
        return new SmartNode(null);
      }
      
      return new SmartNode(((Element) node).getElementsByTagName(name).item(0));
    }
    
    public String toString() {
      return node.toString();
    }
  }
  
  /**
   * Returns an Iterable over the children of a given DOM Node that match a given filter.
   * @param node
   * @param filter
   * @return
   */
  public static final Iterable<Node> children(Node node, Iterables.Filter<Node> filter) {
    return Iterables.filter(iter(node.getChildNodes()), filter);
  }
    
  /**
   * Returns an Iterable over the DOM API's NodeList.
   * @param list
   * @return
   */
  public static final Iterable<Node> iter(NodeList list) {
    return new Iterable<Node>() {
      @Override
      public Iterator<Node> iterator() {
        return new NodeListIterator(list);
      }
    };
  }
  
  /**
   * Returns an Iterable over the DOM API's NamedNodeMap.
   * @param map
   * @return
   */
  public static final Iterable<Map.Entry<String, Node>> iter(NamedNodeMap map) {
    return new Iterable<Map.Entry<String, Node>>() {
      @Override
      public Iterator<Map.Entry<String, Node>> iterator() {
        return new NamedNodeMapIterator(map);
      }
    };
  }
  
  /**
   * Provides an Iterator over the DOM API's NodeListIterator.
   */
  private static final class NodeListIterator implements Iterator<Node> {
    private final NodeList list;
    private int position;
    
    public NodeListIterator(NodeList list) {
      this.list = list;
      this.position = 0;
    }

    @Override
    public boolean hasNext() {
      return position < list.getLength();
    }

    @Override
    public Node next() {
      position += 1;
      return list.item(position - 1);
    }
  }
  
  /**
   * Provides an Iterator over the DOM API's NamedNodeMap.
   */
  private static final class NamedNodeMapIterator implements Iterator<Map.Entry<String, Node>> {
    private final NamedNodeMap list;
    private int position;
    
    public NamedNodeMapIterator(NamedNodeMap list) {
      this.list = list;
      this.position = 0;
    }

    @Override
    public boolean hasNext() {
      return position < list.getLength();
    }

    @Override
    public Map.Entry<String, Node> next() {
      Node item = list.item(position);
      position += 1;
      return new MapEntry<>(item.getNodeName(), item);
    }
  }
  
  /**
   * Provides a simple, immutable Map.Entry implementation.
   * @param <K>
   * @param <V>
   */
  private static final class MapEntry<K, V> implements Map.Entry<K, V> {
    private final K key;
    private final V value;
    
    public MapEntry(K key, V value) {
      this.key = key;
      this.value = value;
    }

    @Override
    public K getKey() {
      return key;
    }

    @Override
    public V getValue() {
      return value;
    }

    @Override
    public V setValue(V value) {
      throw new UnsupportedOperationException();
    }
  }
}
